"""为部署后的项目播放页生成简历用二维码 PNG。"""

from __future__ import annotations

import argparse
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description="生成项目播放页二维码")
    parser.add_argument("url", help="部署后的完整 HTTPS 播放页地址")
    parser.add_argument(
        "--output",
        default="项目演示二维码.png",
        help="输出 PNG 路径（默认：项目演示二维码.png）",
    )
    args = parser.parse_args()

    if not args.url.lower().startswith("https://"):
        parser.error("请使用部署后的 https:// 公网地址，不能使用本机文件路径或 localhost。")

    try:
        import qrcode
        from qrcode.constants import ERROR_CORRECT_H
    except ImportError as exc:
        raise SystemExit(
            "缺少 qrcode：请先运行 python -m pip install -r requirements.txt"
        ) from exc

    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=14,
        border=4,
    )
    qr.add_data(args.url)
    qr.make(fit=True)
    image = qr.make_image(fill_color="#07111f", back_color="white")

    output = Path(args.output).resolve()
    image.save(output)
    print(f"二维码已生成：{output}")
    print(f"目标地址：{args.url}")


if __name__ == "__main__":
    main()
