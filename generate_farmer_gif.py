from PIL import Image, ImageDraw
import math

SIZE = 200
BG = (220, 50, 47)       # red background
FG = (20, 15, 10)        # near-black ink

def draw_farmer(draw, frame, total_frames):
    t = frame / total_frames  # 0.0 → 1.0

    # Walking cycle parameters
    walk = math.sin(t * 2 * math.pi)       # -1 to 1, full walk cycle
    bob = abs(math.sin(t * 2 * math.pi))   # 0 to 1, body bob (up on each step)

    cx = SIZE // 2
    body_y = int(95 - bob * 4)  # slight vertical bob

    # --- Ground rays ---
    ray_cx = cx
    ray_cy = SIZE - 18
    ray_count = 9
    for i in range(ray_count):
        angle = math.pi + (i - (ray_count - 1) / 2) * 0.22
        x1 = ray_cx + int(20 * math.cos(angle))
        y1 = ray_cy + int(8 * math.sin(angle))
        x2 = ray_cx + int(55 * math.cos(angle))
        y2 = ray_cy + int(22 * math.sin(angle))
        draw.line([(x1, y1), (x2, y2)], fill=FG, width=3)

    # --- Legs ---
    hip_y = body_y + 52
    foot_l_x = cx - 10 + int(walk * 10)
    foot_r_x = cx + 10 - int(walk * 10)
    foot_y = body_y + 82
    knee_l_x = cx - 8 + int(walk * 5)
    knee_r_x = cx + 8 - int(walk * 5)
    knee_y = body_y + 68

    draw.line([(cx - 5, hip_y), (knee_l_x, knee_y), (foot_l_x, foot_y)], fill=FG, width=7)
    draw.line([(cx + 5, hip_y), (knee_r_x, knee_y), (foot_r_x, foot_y)], fill=FG, width=7)

    # Boots
    draw.ellipse([foot_l_x - 8, foot_y - 4, foot_l_x + 8, foot_y + 7], fill=FG)
    draw.ellipse([foot_r_x - 8, foot_y - 4, foot_r_x + 8, foot_y + 7], fill=FG)

    # --- Body ---
    draw.rounded_rectangle([cx - 17, body_y + 20, cx + 17, body_y + 54], radius=5, fill=FG)

    # --- Basket on back (left side) ---
    bx = cx - 28
    by = body_y + 14
    # Main basket body
    basket_pts = [
        (bx - 14, by + 6),
        (bx - 20, by + 22),
        (bx - 12, by + 36),
        (bx + 4,  by + 36),
        (bx + 10, by + 22),
        (bx + 6,  by + 6),
    ]
    draw.polygon(basket_pts, fill=FG)
    # Weave lines on basket
    for i in range(3):
        yy = by + 12 + i * 8
        draw.line([(bx - 18, yy), (bx + 8, yy)], fill=BG, width=2)
    for i in range(4):
        xx = bx - 16 + i * 8
        draw.line([(xx, by + 6), (xx - 4, by + 36)], fill=BG, width=1)

    # Produce sticking out of basket top
    for i, angle in enumerate([-0.5, 0.1, 0.6, -0.2]):
        px = bx - 4 + int(12 * math.cos(angle - 1.2))
        py = by + 2 - int(12 * math.sin(angle + 0.3))
        draw.ellipse([px - 4, py - 4, px + 4, py + 4], fill=FG)
        draw.line([(bx - 4, by + 8), (px, py)], fill=FG, width=2)

    # Strap from basket to shoulder
    draw.line([(bx + 6, by + 10), (cx - 10, body_y + 24)], fill=FG, width=5)

    # --- Right arm (holding/picking something) ---
    arm_angle = 0.4 + walk * 0.25
    ax = cx + 17 + int(24 * math.cos(arm_angle))
    ay = body_y + 26 + int(24 * math.sin(arm_angle))
    draw.line([(cx + 14, body_y + 26), (ax, ay)], fill=FG, width=7)

    # Sprig / plant in hand
    for i in range(3):
        leaf_angle = -0.8 + i * 0.5
        lx = ax + int(8 * math.cos(leaf_angle))
        ly = ay - int(8 * math.sin(leaf_angle))
        draw.ellipse([lx - 4, ly - 4, lx + 5, ly + 5], fill=FG)

    # --- Head ---
    draw.ellipse([cx - 13, body_y + 4, cx + 13, body_y + 26], fill=FG)

    # Face details (white eyes, expression)
    eye_offset = int(walk * 1)
    draw.ellipse([cx - 6 + eye_offset, body_y + 9, cx - 2 + eye_offset, body_y + 13], fill=BG)
    draw.ellipse([cx + 2 + eye_offset, body_y + 9, cx + 6 + eye_offset, body_y + 13], fill=BG)

    # --- Hat ---
    # Brim
    draw.ellipse([cx - 22, body_y - 4, cx + 22, body_y + 8], fill=FG)
    # Crown
    draw.rounded_rectangle([cx - 13, body_y - 22, cx + 13, body_y + 2], radius=4, fill=FG)
    # Hat band
    draw.rectangle([cx - 13, body_y - 8, cx + 13, body_y - 3], fill=BG)
    draw.rectangle([cx - 11, body_y - 8, cx + 11, body_y - 4], fill=FG)  # subtle band detail


def make_frame(frame, total):
    img = Image.new("RGB", (SIZE, SIZE), BG)
    draw = ImageDraw.Draw(img)
    draw_farmer(draw, frame, total)
    return img


TOTAL = 12
frames = [make_frame(i, TOTAL) for i in range(TOTAL)]

out_path = "/Users/matteo/Desktop/fazenda/public/farmer.gif"
frames[0].save(
    out_path,
    save_all=True,
    append_images=frames[1:],
    loop=0,
    duration=80,
    optimize=False,
)
print(f"Saved {out_path}")
