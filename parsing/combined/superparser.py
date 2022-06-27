import copy
import json
import os
import requests
import unicodedata
from glob import glob
from PIL import Image

from PIL import GifImagePlugin
import os


def main():
    with open('finalfinal.json', encoding='utf-8') as json_data:
        result = json.load(json_data)


    for tutor, tutor_value in result["tutors"].items():
        if tutor_value["Фото"]:
            print(tutor, tutor_value["Фото"])
            os.mkdir(f"photos/{tutor}")
            for i, url in enumerate(tutor_value["Фото"]):
                img_data = requests.get(url).content
                formatting = url.split('FieldElemFormat=')[1]
                filename = f"photos/{tutor}/{i}.{formatting}"
                with open(filename, 'wb') as handler:
                    handler.write(img_data)
                if formatting == "gif":
                    gif = Image.open(filename)
                    gif.seek(0)
                    mypalette = gif.getpalette()
                    new_image = Image.new("RGB", gif.size)
                    new_image.paste(gif)
                    new_image.save(f"photos/{tutor}/{i}.jpg", format='JPEG')
                    gif.close()
                    os.remove(filename)

    # global_data['tutors'] = json.loads(json_string)
    json_string = json.dumps(result, indent=4, ensure_ascii=False)
    mydata = unicodedata.normalize("NFKD", json_string)

    with open('result3.json', "w", encoding='utf-8') as file:
        file.write(mydata)
    pass


if __name__ == "__main__":
    main()
