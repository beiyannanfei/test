#coding=utf-8

import random, os, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from argparse import ArgumentParser

def cur_file_dir():
     path = sys.path[0]
     if os.path.isdir(path):
         return path
     elif os.path.isfile(path):
         return os.path.dirname(path)

def create_validate_code(chars, size=(120, 40),
     img_type="JPEG",
     mode="RGB",
     bg_color=(255, 255, 255),
     fg_color=(0, 0, 255),
     font_size=20,
     font_type= cur_file_dir() + "/arial.ttf",
     length=4,
     draw_lines=True,
     n_line=(1, 2),
     draw_points=True,
     point_chance = 2):
    '''
    @param size: 图片的大小，格式（宽，高），默认为(120, 40)
    @param chars: 允许的字符集合，格式字符串
    @param img_type: 图片保存的格式，默认为GIF，可选的为GIF，JPEG，TIFF，PNG
    @param mode: 图片模式，默认为RGB
    @param bg_color: 背景颜色，默认为白色
    @param fg_color: 前景色，验证码字符颜色，默认为蓝色#0000FF
    @param font_size: 验证码字体大小
    @param font_type: 验证码字体
    @param length: 验证码字符个数
    @param draw_lines: 是否划干扰线
    @param n_lines: 干扰线的条数范围，格式元组，默认为(1, 2)，只有draw_lines为True时有效
    @param draw_points: 是否画干扰点
    @param point_chance: 干扰点出现的概率，大小范围[0, 100]
    @return: [0]: PIL Image实例
    @return: [1]: 验证码图片中的字符串
    '''

    width, height = size # 宽， 高
    img = Image.new(mode, size, bg_color) # 创建图形
    draw = ImageDraw.Draw(img) # 创建画笔

    def create_lines():
        '''绘制干扰线'''
        line_num = random.randint(*n_line) # 干扰线条数

        for i in range(line_num):
            # 起始点
            begin = (random.randint(0, size[0]), random.randint(0, size[1]))
            #结束点
            end = (random.randint(0, size[0]), random.randint(0, size[1]))
            draw.line([begin, end], fill=(0, 0, 0))

    def create_points():
        '''绘制干扰点'''
        chance = min(100, max(0, int(point_chance))) # 大小限制在[0, 100]
       
        for w in xrange(width):
            for h in xrange(height):
                tmp = random.randint(0, 100)
                if tmp > 100 - chance:
                    draw.point((w, h), fill=(0, 0, 0))

    def create_strs():
        '''绘制验证码字符'''
        c_chars = chars
        strs = ' %s ' % ' '.join(c_chars) # 每个字符前后以空格隔开

        print font_type
        font = ImageFont.truetype(font_type, font_size)
        font_width, font_height = font.getsize(strs)

        draw.text(((width - font_width) / 2, (height - font_height) / 2),
                    strs, font=font, fill=fg_color)
       
        return ''.join(c_chars)

    if draw_lines:
        create_lines()
    if draw_points:
        create_points()
    strs = create_strs()

    # 图形扭曲参数
    params = [1 - float(random.randint(1, 2)) / 100,
              0,
              0,
              0,
              1 - float(random.randint(1, 10)) / 100,
              float(random.randint(1, 2)) / 500,
              0.001,
              float(random.randint(1, 2)) / 500
              ]
    #img = img.transform(size, Image.PERSPECTIVE, params) # 创建扭曲
    #img = img.filter(ImageFilter.EDGE_ENHANCE_MORE) # 滤镜，边界加强（阈值更大）
    return img, strs

if __name__ == "__main__":
    parser = ArgumentParser(usage = "python gv.py -t abcd -f output-file")
    parser.add_argument('-t', "--text", dest="str", required = True, help="verify text");
    parser.add_argument('-f', "--outfile", dest="outFile", required = True, help="verify pic url")

    args = parser.parse_args()
    if not len(sys.argv) > 4:
        parser.print_help()
    else:
        data = create_validate_code(args.str)
        data[0].save(args.outFile, "JPEG")