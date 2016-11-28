--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 16/11/17
-- Time: 下午12:49
-- To change this template use File | Settings | File Templates.
-- 练习使用nginx的内置变量

-- 请求中的name参数
ngx.log(ngx.INFO, string.format("======== $arg_name ========: %s                 ===", ngx.var.arg_a));
-- 请求中的参数
ngx.log(ngx.INFO, string.format("======== $args ========: %s                     ===", ngx.var.args));
-- 远程地址的二进制表示
ngx.log(ngx.INFO, string.format("======== $binary_remote_addr ========: %s       ===", ngx.var.binary_remote_addr));
-- 已发送的消息体字节数
ngx.log(ngx.INFO, string.format("======== $body_bytes_sent ========: %s          ===", ngx.var.body_bytes_sent));
-- HTTP请求信息里的"Content-Length"
ngx.log(ngx.INFO, string.format("======== $content_length ========: %s           ===", ngx.var.content_length));
-- 请求信息里的"Content-Type"
ngx.log(ngx.INFO, string.format("======== $content_type ========: %s             ===", ngx.var.content_type));
-- 针对当前请求的根路径设置值
ngx.log(ngx.INFO, string.format("======== document_root ========: %s             ===", ngx.var.document_root));
-- 与$uri相同; 比如 /test2/test.php
ngx.log(ngx.INFO, string.format("======== document_uri ========: %s              ===", ngx.var.document_uri));
-- 请求信息中的"Host"，如果请求中没有Host行，则等于设置的服务器名
ngx.log(ngx.INFO, string.format("======== host ========: %s                      ===", ngx.var.host));
-- 机器名使用 gethostname系统调用的值
ngx.log(ngx.INFO, string.format("======== hostname ========: %s                  ===", ngx.var.hostname));
-- cookie 信息
ngx.log(ngx.INFO, string.format("======== http_cookie ========: %s               ===", ngx.var.http_cookie));
-- 引用地址
ngx.log(ngx.INFO, string.format("======== http_referer ========: %s              ===", ngx.var.http_referer));
-- 客户端代理信息
ngx.log(ngx.INFO, string.format("======== http_user_agent ========: %s           ===", ngx.var.http_user_agent));
-- 最后一个访问服务器的Ip地址
ngx.log(ngx.INFO, string.format("======== http_via ========: %s                  ===", ngx.var.http_via));
-- 相当于网络访问路径
ngx.log(ngx.INFO, string.format("======== http_x_forwarded_for ========: %s      ===", ngx.var.http_x_forwarded_for));
-- 如果请求行带有参数，返回“?”，否则返回空字符串
ngx.log(ngx.INFO, string.format("======== is_args ========: %s                   ===", ngx.var.is_args));
-- 对连接速率的限制
ngx.log(ngx.INFO, string.format("======== limit_rate ========: %s                ===", ngx.var.limit_rate));
-- 当前运行的nginx版本号
ngx.log(ngx.INFO, string.format("======== nginx_version ========: %s             ===", ngx.var.nginx_version));
-- worker进程的PID
ngx.log(ngx.INFO, string.format("======== pid ========: %s                       ===", ngx.var.pid));
-- 与$args相同
ngx.log(ngx.INFO, string.format("======== query_string ========: %s              ===", ngx.var.query_string));
-- 按root指令或alias指令算出的当前请求的绝对路径。其中的符号链接都会解析成真是文件路径
ngx.log(ngx.INFO, string.format("======== realpath_root ========: %s             ===", ngx.var.realpath_root));
-- 客户端IP地址
ngx.log(ngx.INFO, string.format("======== remote_addr ========: %s               ===", ngx.var.remote_addr));
-- 客户端端口号
ngx.log(ngx.INFO, string.format("======== remote_port ========: %s               ===", ngx.var.remote_port));
-- 客户端用户名，认证用
ngx.log(ngx.INFO, string.format("======== remote_user ========: %s               ===", ngx.var.remote_user));
-- 用户请求
ngx.log(ngx.INFO, string.format("======== request ========: %s                   ===", ngx.var.request));
-- 这个变量（0.7.58+）包含请求的主要信息。在使用proxy_pass或fastcgi_pass指令的location中比较有意义
ngx.log(ngx.INFO, string.format("======== request_body ========: %s              ===", ngx.var.request_body));
-- 客户端请求主体信息的临时文件名
ngx.log(ngx.INFO, string.format("======== request_body_file ========: %s         ===", ngx.var.request_body_file));
-- 如果请求成功，设为"OK"；如果请求未完成或者不是一系列请求中最后一部分则设为空
ngx.log(ngx.INFO, string.format("======== request_completion ========: %s        ===", ngx.var.request_completion));
-- 当前请求的文件路径名，比如/opt/nginx/www/test.php
ngx.log(ngx.INFO, string.format("======== request_filename ========: %s          ===", ngx.var.request_filename));
-- 请求的方法，比如"GET"、"POST"等
ngx.log(ngx.INFO, string.format("======== request_method ========: %s            ===", ngx.var.request_method));
-- 请求的URI，带参数
ngx.log(ngx.INFO, string.format("======== request_uri ========: %s               ===", ngx.var.request_uri));
-- 所用的协议，比如http或者是https
ngx.log(ngx.INFO, string.format("======== scheme ========: %s                    ===", ngx.var.scheme));
-- 服务器地址，如果没有用listen指明服务器地址，使用这个变量将发起一次系统调用以取得地址(造成资源浪费)
ngx.log(ngx.INFO, string.format("======== server_addr ========: %s               ===", ngx.var.server_addr));
-- 请求到达的服务器名
ngx.log(ngx.INFO, string.format("======== server_name ========: %s               ===", ngx.var.server_name));
-- 请求到达的服务器端口号
ngx.log(ngx.INFO, string.format("======== server_port ========: %s               ===", ngx.var.server_port));
-- 请求的协议版本，"HTTP/1.0"或"HTTP/1.1"
ngx.log(ngx.INFO, string.format("======== server_protocol ========: %s           ===", ngx.var.server_protocol));
-- 请求的URI，可能和最初的值有不同，比如经过重定向之类的
ngx.log(ngx.INFO, string.format("======== uri ========: %s                       ===", ngx.var.uri));
