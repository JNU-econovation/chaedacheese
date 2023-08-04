import math
from sklearn import neighbors
import os
import os.path
import sys
import pickle
from PIL import Image, ImageDraw, ImageFont
import face_recognition
from face_recognition.face_recognition_cli import image_files_in_folder
import pandas as pd

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


def predict(X_img_path, gender, knn_clf=None, model_path=None, distance_threshold=1):

    total_df = pd.read_csv('C:/Users/user/Desktop/summerdev/summerdev/server/model/total_df.csv', encoding='utf-8')

    # Load a trained KNN model (if one was passed in)
    if knn_clf is None:
        with open(model_path, 'rb') as f:
            knn_clf = pickle.load(f)

    # Load image file and find face locations
    X_img = face_recognition.load_image_file(X_img_path)
    X_face_locations = face_recognition.face_locations(X_img)

    # If no faces are found in the image, return an empty result.
    if len(X_face_locations) == 0:
        return []

    # Find encodings for faces in the test iamge
    faces_encodings = face_recognition.face_encodings(X_img, known_face_locations=X_face_locations)


    # Use the KNN model to find the best matches for the test face
    closest_distances = knn_clf.kneighbors(faces_encodings, n_neighbors=10)
    
    are_matches = []

    for i in range(len(X_face_locations)):
        for j in range(10):
            are_match = [closest_distances[0][i][j] <= distance_threshold]
            are_matches.append(are_match) 


    label = knn_clf.classes_
    prob = knn_clf.predict_proba(faces_encodings)[0]
            
    result = dict()
    res = dict()
    prd = list()

    for i in range(len(label)):
        result[label[i]] = prob[i]
    result.pop('fromi')
   
    
    if gender == 'M':
        for i in range(len(total_df['Name'][total_df['Gender'] =='F'])):
            result.pop(list(total_df['Name'][total_df['Gender'] =='F'])[i])    
    elif gender == 'F':
        for i in range(len(total_df['Name'][total_df['Gender'] =='M'])):
            result.pop(list(total_df['Name'][total_df['Gender'] =='M'])[i])      
        
    sorted_result = sorted(result.values(), reverse=True)
    top_3 = sorted_result[:3]
    for i in range(len(top_3)):
        # prd.append(([k for k, v in result.items() if v==top_3[i]][0], top_3[i] / sum(top_3), X_face_locations[0]))

        name = [k for k, v in result.items() if v==top_3[i]][0]

        if ':' in name:
            name = name.replace(':', '_')


        res[str(i)] = { "name": name,
                   "prob": str(top_3[i] / sum(top_3)),
                   "coor": str(X_face_locations[0]) }

    print(str(res).replace('*', '').replace('\'', '\"'))
    # sys.stdout.flush()
    return res

def show_prediction_labels_on_image(img_path, predictions):
    """
    Shows the face recognition results visually.

    :param img_path: path to image to be recognized
    :param predictions: results of the predict function
    :return:
    """
    
    # download font
#     !wget "https://www.wfonts.com/download/data/2016/06/13/malgun-gothic/malgun.ttf"
#     !mv malgun.ttf /data/home/chaewon215/ECNV/Dev Project
    
    
    pil_image = Image.open(img_path).convert("RGB")
    width = pil_image.size[0]
    draw = ImageDraw.Draw(pil_image)
    font_size = int(width * (10/450))
    draw.font = ImageFont.truetype('C:/Users/user/Desktop/summerdev/summerdev/src/fonts/HeirofLightRegular.ttf', font_size)

    preds = []
    name_str = ''

    for predict in predictions:
        name, prob, (top, right, bottom, left) = predict
        preds.append((name, prob))

    draw.rectangle(((left, top), (right, bottom)), outline=(0, 0, 255), width=int(width * (2/400)))
    text_width, _ = draw.textsize(name)
    text_height = font_size * 3 + 20

    draw.rectangle(((left, bottom), (right, bottom + text_height)), fill=(0, 0, 255), outline=(0, 0, 255))


    for i in range(len(preds)):
        name_str += str(str(i+1) +'위: '+ preds[i][0] + ' ' + str(round(preds[i][1], 4)) + '\n')

    draw.text((left + 6, bottom ), name_str, fill=(255, 255, 255, 255))


    # Remove the drawing library from memory as per the Pillow docs
    del draw

    # Display the resulting image
    pil_image.save("C:/Users/user/Desktop/summerdev/summerdev/server/model/results/" + img_path.split('/')[-1][:-4] + '_detected.jpg')


if __name__ == "__main__":
    # STEP 2: Using the trained classifier, make predictions for unknown images

    predictions = predict(sys.argv[1], sys.argv[2], model_path="C:/Users/user/Desktop/summerdev/summerdev/server/model/model_save_aug.clf")
    # show_prediction_labels_on_image(sys.argv[1], predictions)
