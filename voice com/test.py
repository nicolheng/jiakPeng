import cv2
cam = cv2.VideoCapture(0)
result, image = cam.read()
cv2.imwrite("temp.png",image)
if result:
    print("photo success")
else:
    print("camera problem occur")