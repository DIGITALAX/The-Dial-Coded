const promptImageResize = (element: any) => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  element.clipElement?.points.forEach((point: any) => {
    if (point.x < minX) {
      minX = point.x;
    }
    if (point.x > maxX) {
      maxX = point.x;
    }
    if (point.y < minY) {
      minY = point.y;
    }
    if (point.y > maxY) {
      maxY = point.y;
    }
  });

  const width = maxX - minX;
  const height = maxY - minY;

  const imageAspectRatio = element.image.width / element.image.height;
  const pathAspectRatio = width / height;
  let destWidth, destHeight, destX, destY;

  if (imageAspectRatio >= pathAspectRatio) {
    destWidth = width;
    destHeight = width / imageAspectRatio;
    destX = minX;
    destY = minY + (height - destHeight) / 2;
  } else {
    destWidth = height * imageAspectRatio;
    destHeight = height;
    destX = minX + (width - destWidth) / 2;
    destY = minY;
  }

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  destX = centerX - destWidth / 2;
  destY = centerY - destHeight / 2;
  return { destX, destY, destWidth, destHeight };
};

export default promptImageResize;
