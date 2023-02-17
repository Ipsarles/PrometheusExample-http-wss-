import pyautogui
import time
import random
i=0


def letter():
    abc=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    return abc[random.randint(0,25)]


time.sleep(2)




while i<200:
    i+=1
    
    pyautogui.typewrite(letter())
    pyautogui.typewrite(['enter'])
    time.sleep(random.randint(0,40)/10)