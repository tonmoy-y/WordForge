//! Plain text: UTF-8 (with or without BOM), UTF-16 LE/BE (BOM or sniffed), else Windows-1252.
//! Export writes UTF-8 with CRLF line ends; list paragraphs get their label and a tab, table
//! cells are separated by tabs.

use wordforge_doc::Document;

use crate::model::{FBlock, ListCounter, from_doc};

/// Windows-1252 code points for 0x80..=0x9F.
const CP1252: [u16; 32] = [
    0x20AC, 0x0081, 0x201A, 0x0192, 0x201E, 0x2026, 0x2020, 0x2021, 0x02C6, 0x2030, 0x0160, 0x2039, 0x0152, 0x008D, 0x017D, 0x008F, 0x0090, 0x2018,
    0x2019, 0x201C, 0x201D, 0x2022, 0x2013, 0x2014, 0x02DC, 0x2122, 0x0161, 0x203A, 0x0153, 0x009D, 0x017E, 0x0178,
];

/// One Windows-1252 byte as a char.
pub fn cp1252(b: u8) -> char {
    if (0x80..0xA0).contains(&b) {
        CP1252.get((b - 0x80) as usize).and_then(|u| char::from_u32(u32::from(*u))).unwrap_or('\u{FFFD}')
    } else {
        b as char
    }
}

fn utf16(b: &[u8], le: bool) -> String {
    let units: Vec<u16> = b.as_chunks::<2>().0.iter().map(|c| if le { u16::from_le_bytes(*c) } else { u16::from_be_bytes(*c) }).collect();
    String::from_utf16_lossy(&units)
}

/// Decode text bytes: BOMs first, then UTF-16 without BOM (by its zero bytes), UTF-8, and
/// Windows-1252 as the last resort.
pub fn decode(b: &[u8]) -> String {
    if let Some(rest) = b.strip_prefix(&[0xEF, 0xBB, 0xBF]) {
        return String::from_utf8_lossy(rest).into_owned();
    }
    if let Some(rest) = b.strip_prefix(&[0xFF, 0xFE]) {
        return utf16(rest, true);
    }
    if let Some(rest) = b.strip_prefix(&[0xFE, 0xFF]) {
        return utf16(rest, false);
    }
    if b.len() >= 4 && b.len().is_multiple_of(2) {
        let sample = &b[..b.len().min(512)];
        let even_zero = sample.iter().step_by(2).filter(|x| **x == 0).count();
        let odd_zero = sample.iter().skip(1).step_by(2).filter(|x| **x == 0).count();
        let half = sample.len() / 2;
        if odd_zero * 10 >= half * 4 && even_zero * 10 < half {
            return utf16(b, true);
        }
        if even_zero * 10 >= half * 4 && odd_zero * 10 < half {
            return utf16(b, false);
        }
    }
    match std::str::from_utf8(b) {
        Ok(s) => s.to_string(),
        Err(_) => b.iter().map(|c| cp1252(*c)).collect(),
    }
}

/// A document with one paragraph per line.
pub fn import(bytes: &[u8]) -> Document {
    let text = decode(bytes);
    let text = text.replace("\r\n", "\n").replace('\r', "\n");
    let clean: String = text.chars().filter(|c| !c.is_control() || matches!(c, '\n' | '\t' | '\u{000C}')).collect();
    Document::from_text(&clean)
}

fn blocks_text(blocks: &[FBlock], out: &mut Vec<String>, lists: &mut ListCounter, depth: usize) {
    for b in blocks {
        match b {
            FBlock::Para(p) => {
                let mut line = String::new();
                match p.list {
                    Some(li) => {
                        line.push_str(&"\t".repeat(li.level as usize));
                        line.push_str(&lists.label(li));
                        line.push('\t');
                    }
                    None => lists.reset(),
                }
                line.push_str(&p.text().replace('\n', "\r\n").replace(['\u{000C}', '\u{000E}'], ""));
                out.push(line);
            }
            FBlock::Table(t) => {
                lists.reset();
                for row in &t.rows {
                    let cells: Vec<String> = row
                        .iter()
                        .map(|c| {
                            if depth > 8 {
                                return String::new();
                            }
                            let mut v = Vec::new();
                            blocks_text(&c.blocks, &mut v, &mut ListCounter::default(), depth + 1);
                            v.join(" ")
                        })
                        .collect();
                    out.push(cells.join("\t"));
                }
            }
        }
    }
}

/// UTF-8 text, CRLF line ends.
pub fn export(doc: &Document) -> Vec<u8> {
    let flow = from_doc(doc);
    let mut lines = Vec::new();
    blocks_text(&flow.blocks, &mut lines, &mut ListCounter::default(), 0);
    lines.join("\r\n").into_bytes()
}
