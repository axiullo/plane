---飞一局

local Plane = {
    {
        --上
        {0, 1, 0},
        {1, 1, 1},
        {0, 1, 0},
        {1, 1, 1}
    },
    {
        --左
        {0, 1, 0, 1},
        {1, 1, 1, 1},
        {0, 1, 0, 1},
    },
    {
        --下
        {1, 1, 1},
        {0, 1, 0},
        {1, 1, 1},
        {0, 1, 0},
    },
    {
        --右
        {1, 0, 1, 0},
        {1, 1, 1, 1},
        {1, 0, 1, 0},
    }
}

local map_x = 9
local map_y = 9

---初始地块是0,放置飞机位置是1, 被标识是2
local map = {}

local M = {}

---初始化地图
function M:init_map()
    for i = 1, map_y do
        map[i] = {}

        for n = 1, map_x do
            map[i][n] = 0
        end
    end
end

---是否是有效的位置
function M:is_valid_pos(x, y)
    if x < 1 or x > map_x then
        return false
    end

    if y < 1 or y > map_y then
        return false
    end

    return true
end

---检测是否可安放飞机
---可以提前判断边界值,但是感觉代码写起来不好看,直接for里判断,也没什么效率影响
function M:check_put(dir, x, y)
    local model_plane = Plane[dir]
    local plane_width, plane_high = #model_plane[1], #model_plane
    local px, py = 0, 0
    local max_y = y + plane_high - 1
    local max_x = x + plane_width - 1

    for my = y, max_y do
        py = py + 1
        px = 0

        for mx = x, max_x do
            px = px + 1

            if not self:is_valid_pos(mx, my) then
                return false
            end

            if map[my][mx] ~= 0 and model_plane[py][px] == 1 then
                return false
            end
        end
    end

    return true
end

---安放飞机,以安放位置的左上角为原点
---@param x
---@param y
function M:put_plane(dir, x, y)
    local model_plane = Plane[dir]

    if not model_plane then
        return - 1
    end

    local plane_width = #model_plane[1]
    local plane_high = #model_plane

    if not self:check_put(dir, x, y) then
        return - 2
    end

    local max_y = y + plane_high - 1
    local max_x = x + plane_width - 1
    local px, py = 0, 0

    for my = y, max_y do
        py = py + 1
        px = 0

        for mx = x, max_x do
            px = px + 1

            if map[my][mx] == 0 then
                map[my][mx] = model_plane[py][px]
            end
        end
    end
end

function M:print_map()
    for y = 1, #map do
        local s = ""
        for x = 1, #map[y] do
            if string.len(s) > 0 then
                s = s .. ","
            end

            s = s .. map[y][x]
        end

        print(s)
    end
end

local obj = M;
obj:init_map()
local can = obj:put_plane(1, 2, 1)
obj:put_plane(2, 4, 2)
obj:print_map()

return M
