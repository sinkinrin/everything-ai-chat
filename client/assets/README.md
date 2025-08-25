# 应用图标说明

请将以下格式的图标文件放置在此目录下：

## Windows 图标
- `icon.ico` - Windows 应用图标（建议 256x256 像素，包含多个尺寸）

## macOS 图标  
- `icon.icns` - macOS 应用图标（建议 512x512 像素）

## Linux 图标
- `icon.png` - Linux 应用图标（建议 512x512 像素）

## 图标制作建议
1. 使用高质量的 PNG 图片作为源文件
2. 推荐使用在线转换工具：
   - ICO: https://icoconvert.com/
   - ICNS: https://cloudconvert.com/png-to-icns
3. 确保图标在小尺寸下仍然清晰可见

如果暂时没有图标文件，可以删除 package.json 中的 icon 配置项，electron-builder 会使用默认图标。