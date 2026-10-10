//! Optional extra CJK fonts build input. With `FONTS_DIR=<checkout>`
//! the fonts in its `fonts/manifest.txt` are embedded as `EXTRA_FONTS`; unset, `EXTRA_FONTS` is empty.
//! Web (wasm32) builds embed only the UI face, BIZ UDPGothic Regular, to stay within the web size budget.
use std::fmt::Write as _;
use std::path::PathBuf;

fn main() {
    println!("cargo::rerun-if-env-changed=FONTS_DIR");
    println!("cargo::rerun-if-env-changed=FONTS_REQUIRED");
    let mut src = String::from("pub static EXTRA_FONTS: &[ExtraFont] = &[\n");
    let font_dir = std::env::var_os("FONTS_DIR").map(PathBuf::from);
    if let Some(dir) = font_dir {
        match extra_fonts(&dir) {
            Ok(entries) => src.push_str(&entries),
            Err(e) if std::env::var_os("FONTS_REQUIRED").is_some() => {
                println!("cargo::error=FONTS_DIR={}: {e}", dir.display());
            }
            Err(e) => println!("cargo::warning=building without fallback fonts: FONTS_DIR={}: {e}", dir.display()),
        }
    }
    src.push_str("];\n");
    let out = PathBuf::from(std::env::var_os("OUT_DIR").unwrap_or_default()).join("extra_fonts.rs");
    if let Err(e) = std::fs::write(&out, src) {
        println!("cargo::error=writing {}: {e}", out.display());
    }
}

/// One `ExtraFont { .. }` initialiser per manifest line.
fn extra_fonts(dir: &std::path::Path) -> Result<String, String> {
    let manifest = dir.join("fonts/manifest.txt");
    println!("cargo::rerun-if-changed={}", manifest.display());
    let text = std::fs::read_to_string(&manifest).map_err(|e| format!("{}: {e}", manifest.display()))?;
    let wasm = std::env::var("CARGO_CFG_TARGET_ARCH").is_ok_and(|a| a == "wasm32");
    let mut out = String::new();
    for line in text.lines().map(str::trim).filter(|l| !l.is_empty() && !l.starts_with('#')) {
        let f: Vec<&str> = line.split(" | ").map(str::trim).collect();
        let [family, style, file, scripts, ..] = f.as_slice() else {
            return Err(format!("malformed manifest line: {line}"));
        };
        if wasm && !(*family == "BIZ UDPGothic" && *style == "Regular") {
            continue;
        }
        let path = dir.join(file).canonicalize().map_err(|e| format!("{file}: {e}"))?;
        println!("cargo::rerun-if-changed={}", path.display());
        let scripts: Vec<String> = scripts.split(',').map(|s| format!("{:?}", s.trim())).collect();
        let _ = writeln!(
            out,
            "    ExtraFont {{ family: {family:?}, style: {style:?}, scripts: &[{}], bytes: include_bytes!({:?}) }},",
            scripts.join(", "),
            path.display().to_string(),
        );
    }
    Ok(out)
}
