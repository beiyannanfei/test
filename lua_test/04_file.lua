--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 16/10/21
-- Time: 下午3:52
-- To change this template use File | Settings | File Templates.
--
local file = io.input("./04_file.lua"); --读取当前文件

repeat
    local line = io.read(); --逐行读取,文件结束时返回nil
    if nil == line then
        break;
    end
    print(line);
until (false);

io.close(file);
