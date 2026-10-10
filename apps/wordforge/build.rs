//! Windows only: embed the app icon and version info (VERSIONINFO) into `wordforge.exe`, so it
//! shows in Explorer, the taskbar, the Start menu and Alt-Tab.
//!
//! On every other target this does nothing. A missing resource compiler is a warning, so a
//! cross-compile from macOS or Linux still links, unless `WORDFORGE_REQUIRE_WINRES=1` turns it
//! into an error (for release builds).

fn main() {
    println!("cargo:rerun-if-changed=build.rs");
    println!("cargo:rerun-if-changed=../../assets/app-icon/wordforge.ico");
    println!("cargo:rerun-if-env-changed=WORDFORGE_REQUIRE_WINRES");
    if std::env::var("CARGO_CFG_TARGET_OS").as_deref() != Ok("windows") {
        return;
    }
    let mut res = winresource::WindowsResource::new();
    res.set_icon("../../assets/app-icon/wordforge.ico")
        .set("ProductName", "WordForge")
        .set("FileDescription", "WordForge word processor")
        .set("CompanyName", "WordForge")
        .set("LegalCopyright", "Copyright (c) the WordForge authors. MIT OR Apache-2.0.")
        .set("OriginalFilename", "wordforge.exe")
        .set("InternalName", "wordforge");
    if let Err(e) = res.compile() {
        if std::env::var_os("WORDFORGE_REQUIRE_WINRES").is_some() {
            eprintln!("embedding Windows resources failed: {e}");
            std::process::exit(1);
        }
        println!("cargo:warning=wordforge.exe built without icon/version resources: {e}");
    }
}
