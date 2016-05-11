#!/usr/bin/env bash
echo "============ 定义/读取数组 ============";
array_name=("aaa", "bbbb")
array_name[2]="ccccc"
array_name[3]="dddddd"
echo "first index: ${array_name[0]}"
echo "all element ${array_name[*]}"
echo "all element ${array_name[@]}"

echo "============ 获取数组的长度 ============";
echo "array length: ${#array_name[@]}"
echo "array length: ${#array_name[*]}"
echo "array length: ${#array_name[2]}"