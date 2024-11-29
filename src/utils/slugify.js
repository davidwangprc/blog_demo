import slugify from "slugify";
import toPinyin from "chinese-to-pinyin";

export const createSlug = (title) => {
  const timestamp = Date.now();
  
  // 检查是否包含中文字符
  const hasChinese = /[\u4e00-\u9fa5]/.test(title);
  
  if (hasChinese) {
    // 提取前两个中文字符
    const chineseChars = title.match(/[\u4e00-\u9fa5]{1,2}/)[0];
    
    // 转换为拼音
    const pinyinResult = toPinyin(chineseChars, {
      removeSpace: true,
      toneToNumber: false
    }).toLowerCase().replace(/\s+/g, '-');
    
    // 生成随机的十六进制字符串（4位）
    const randomHex = Math.floor(Math.random() * 0xFFFF)
      .toString(16)
      .padStart(4, '0');
    
    return `${timestamp}-${pinyinResult}-${randomHex}`;
  }
  
  // 非中文标题使用原来的 slugify 处理
  const titleSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g
  });

  return `${timestamp}-${titleSlug || 'untitled'}`;
}; 