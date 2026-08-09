// RFC 5545仕様のテキストエスケープ
export function escapeICalText(value: string): string{
    return value
    .replace(/\\/g, "\\\\") // バックスラッシュをエスケープ
    .replace(/;/g, "\\;")   // セミコロンをエスケープ
    .replace(/,/g, "\\,")   // カンマをエスケープ
    .replace(/\r?\n/g, "\\n"); // 改行をエスケープ
}