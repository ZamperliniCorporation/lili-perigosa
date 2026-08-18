from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "assets"
THRESHOLD = 28


def is_background(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, _alpha = pixel
    return red < THRESHOLD and green < THRESHOLD and blue < THRESHOLD


def knockout(path: Path) -> None:
    image = Image.open(path).convert("RGBA")
    pixels = image.load()
    width, height = image.size
    seen = [[False] * width for _ in range(height)]
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if x < 0 or y < 0 or x >= width or y >= height or seen[y][x]:
            continue
        seen[y][x] = True
        pixel = pixels[x, y]
        if not is_background(pixel):
            continue
        pixels[x, y] = (0, 0, 0, 0)
        queue.extend(((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)))

    image.save(path)
    print(f"updated {path.name} ({width}x{height})")


def repair_standing_eye(path: Path) -> None:
    image = Image.open(path).convert("RGBA")
    pixels = image.load()
    width, height = image.size
    iris_x, iris_y = 162, 297
    white = (247, 244, 240, 255)
    queue: deque[tuple[int, int, int]] = deque()
    seen: set[tuple[int, int]] = set()

    for y in range(230, 370):
        for x in range(90, 240):
            red, green, blue, alpha = pixels[x, y]
            if alpha > 80 and red > 200 and green > 200 and blue > 200:
                queue.append((x, y, 0))
                seen.add((x, y))

    filled = 0
    while queue:
        x, y, depth = queue.popleft()
        if depth > 36:
            continue
        if (x - iris_x) ** 2 + (y - iris_y) ** 2 > 74 * 74:
            continue
        if pixels[x, y][3] < 40:
            pixels[x, y] = white
            filled += 1
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in seen:
                if pixels[nx, ny][3] < 40:
                    seen.add((nx, ny))
                    queue.append((nx, ny, depth + 1))

    image.save(path)
    print(f"repaired standing eye in {path.name} ({filled} px)")


if __name__ == "__main__":
    knockout(ROOT / "pascal-deitado.png")
    knockout(ROOT / "pascal-de-pe.png")
    repair_standing_eye(ROOT / "pascal-de-pe.png")
