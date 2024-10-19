import numpy as np
import matplotlib.pyplot as plt
import cv2

class ImageSeg:
    def __init__(self, path):
        self.path = path
        self.img = plt.imread(path)
        self.threshold = 0

    def RGNull(self):
        arr = np.array(self.img)
        greenval = 0
        count = 0
        for i in range(len(arr)):
            for j in range(len(arr[i])):
                greenval += arr[i][j][1]
                count += 1
                arr[i][j][0] = 0
                arr[i][j][2] = 0
        self.threshold = (greenval / count) / 1.5
        return arr

    def IsoGray(self):
        RGNull_img = self.RGNull()
        gray_img = cv2.cvtColor(RGNull_img, cv2.COLOR_RGB2GRAY)
        return gray_img

    def IsoGrayThresh(self):
        gray_img = self.IsoGray()
        for i in range(len(gray_img)):
            for j in range(len(gray_img[i])):
                gray_img[i][j] = 255 if gray_img[i][j] > self.threshold else 0
        return gray_img

    def PixelCount(self):
        arr = self.IsoGrayThresh()
        count = np.sum(arr != 0)
        return count
    