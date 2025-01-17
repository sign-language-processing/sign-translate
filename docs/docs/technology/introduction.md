# Our Approach

Following the research of Dr. Amit Moryosef's published in his PhD thesis[^amit-thesis], we aim to develop a sign language translation system that separates the computer vision tasks from the language translation tasks. This division ensures a more modular and robust approach to achieving high-quality translations.

[^amit-thesis]: Amit Moryosef. 2024. [Real-Time Multilingual Sign Language Processing](https://arxiv.org/abs/2412.01991).

## Spoken to Signed Language Translation

Following, is a flowchart of the current translation pipeline from spoken to signed language.
Each node represents a different module or function in the pipeline, with a link to the relevant code repository.

- <span style="color: green">Green</span> edges represent high quality modules.
- <span style="color: orange">orange</span> edges represent existing, low quality modules.
- <span style="color: red">red</span> edges represent modules that need to be implemented.

```mermaid
flowchart TD
  A0[Spoken Language Audio] --> A1(Spoken Language Text)
  A1[Spoken Language Text] --> B[<a target='_blank' href='https://github.com/sign/translate/issues/10'>Language Identification</a>]
  A1 --> C(<a target='_blank' href='https://github.com/sign/translate/tree/master/functions/src/text-normalization'>Normalized Text</a>)
  B --> C
  C & B --> Q(<a target='_blank' href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter'>Sentence Splitter</a>)
  Q & B --> D(<a target='_blank' href='https://github.com/sign-language-processing/signbank-plus'>SignWriting</a>)
  C -.-> M(<a target='_blank' href='https://github.com/ZurichNLP/spoken-to-signed-translation' title='We would like to move away from glosses'>Glosses</a>)
  M -.-> E
  D --> E(<a target='_blank' href='https://github.com/sign-language-processing/signwriting-animation'>Pose Sequence</a>)
  D -.-> I(<a target='_blank' href='https://github.com/sign-language-processing/signwriting-illustration'>Illustration</a>)
  N --> H(<a target='_blank' href='https://github.com/sign/translate/issues/68'>3D Avatar</a>)
  N --> G(<a target='_blank' href='https://github.com/sign-language-processing/pose'>Skeleton Viewer</a>)
  N --> F(<a target='_blank' href='https://github.com/sign-language-processing/pose-to-video' title='Help wanted!'>Human GAN</a>)
  H & G & F --> J(Video)
  J --> K(Share Translation)
  D -.-> L(<a target='_blank' href='https://github.com/sign-language-processing/signwriting-description' title='Poor performance. Help wanted!'>Description</a>)
  O --> N(<a target='_blank' href='https://github.com/sign-language-processing/fluent-pose-synthesis' title='Currently skipped. Help Wanted!'>Fluent Pose Sequence</a>)
  E --> O(<a target='_blank' href='https://github.com/sign-language-processing/pose-anonymization'>Pose Appearance Transfer</a>)

linkStyle default stroke:green;
linkStyle 3,5,7 stroke:lightgreen;
linkStyle 10,11,12,15 stroke:red;
linkStyle 6,8,9,14,19,20 stroke:orange;
```

This pipeline represents two types of approaches to translation:

1. **Dictionary Based Translation**
2. **SignWriting based Machine Translation**

### Dictionary Based Translation[^dictionary-baseline]

[^dictionary-baseline]: Moryossef et al. 2023. [An Open-Source Gloss-Based Baseline for Spoken to Signed Language Translation](https://aclanthology.org/2023.at4ssl-1.3/).

The dictionary-based translation approach aims to simplify the translation but sacrifices the fluency and natural expressiveness needed for accurate sign language communication. It can be characterized by the following general steps:

```mermaid
flowchart LR
  a[Spoken Language Text] --> b[Glosses] --> c[Pose Sequence] --> d[Video]
```

![Visualization of one example through the dictionary-based translation pipeline](./assets//dictionary-pipeline.png)

#### **Main Translation Steps**

1. **text-to-gloss translation**: The input spoken language text is transformed into glosses using techniques such as lemmatization, word reordering, and dropping unnecessary words (like articles).

2. **gloss-to-pose conversion**: ‘Glosses’ are mapped to corresponding skeletal poses extracted from a sign language dictionary.

3. **pose-to-video rendering**: The pose sequences are stitched together and rendered back into a synthesized human video.

#### **Data Requirements**

A dictionary of sign language videos for isolated letters, words, and phrases. This dictionary cannot represent the full expressiveness of sign language.

#### **Potential Quality**

Even if the dictionary is complete, this approach cannot fully capture the complexity of sign language. While it attempts to translate from text to a gloss-based structure and map that to movements (poses), it fails to account for the full grammatical and syntactic richness of sign language. Glosses are an incomplete representation of actual signs, and grammar in sign language differs substantially from spoken languages.

### SignWriting based Machine Translation

The machine translation approach aims to achieve similar translation quality to spoken language translation systems such as Google Translate, with potentially high fluency and natural expressiveness. This approach further allows for bi-directional translation, between signed and spoken languages.

```mermaid
flowchart LR
  a[Spoken Language Text] --> b[SignWriting] --> c[Pose Sequence] --> d[Video]
```

![Visualization of one example through the SignWriting-based translation pipeline](./assets/sign-tube-example.png)

#### **Main Translation Steps:**

1. **text-to-SignWriting Translation**: Spoken language text is translated into SignWriting sequences using machine translation (it sees a lot of data, and extrapolates from it). Timothy Comment: What is the conntext for this? are you explaining something to the reader here? 

2. **SignWriting-to-pose conversion**: The written signs are converted into a fluent pose sequence, illustrating how the signs would be physically performed by a signer. Timothy Comment: would this not be more accurate: The Signwriting sequences are converted into fluent pose sequence that illustrates how the sign would be performed by a signer. 

3. **pose-to-video rendering**: This pose sequence is then rendered into a human video.

#### **Data Requirements:**

By combining a relatively small dataset of transcribed single signs (~100k) with a relatively small dataset of segmented continuous signs, and leveraging large video/text sign language datasets, we can automatically transcribe the latter. This process will generate large synthesized datasets for both **text-to-SignWriting** and **SignWriting-to-pose** conversions. Timothy Comment: I dont see how someone not fully emerged in this topic can follow, it took me too much brain power to understand what "the latter" referenced to. ChatGPT suggestion: 

Our approach optimizes data efficiency by combining:

- A relatively small dataset of transcribed single signs (~100k instances).
- A relatively small dataset of segmented continuous signs.

These smaller datasets are used to enable the automated transcription of large video/text sign language datasets. This process generates extensive synthesized datasets for both text-to-SignWriting and SignWriting-to-pose conversions, significantly enhancing the scalability and accuracy of our models.

#### **Potential Quality**

The system aims to accurately represent sign language grammar and structure, allowing for a good translation of both lexical and non-lexical signs, expressions, and classifiers.
Potentially, the system can be as good as a deaf human translator, given quality data.

#### **Motivating Examples**

##### Robustness to minor inconsequential changes

Here is an example where a minor, inconsequential, and possibly even **wrong** modification to the spoken language yields the same correct translation in SignWriting (the sign for the city of zurich) but the dictionary yields different ones.

| Text                                                         | Machine Translation                                                                | Dictionary Translation                          |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ----------------------------------------------- |
| [Zürich](https://sign.mt/?spl=de&sil=sgg&text=Z%C3%BCrich)   | ![SignWriting for Zurich in Swiss-German Sign Language](assets/zurich/Zürich.png)  | The sign for Zurich (correct)                   |
| [Zurich](https://sign.mt/?spl=de&sil=sgg&text=Zurich)        | ![SignWriting for Zurich in Swiss-German Sign Language](assets/zurich/Zurich.png)  | Spelling the city name without umlaut (strange) |
| [Züerich](https://sign.mt/?spl=de&sil=sgg&text=Z%C3%BCerich) | ![SignWriting for Zurich in Swiss-German Sign Language](assets/zurich/Züerich.png) | Spelling the city name (strange)                |

##### Adaptivity to minor important changes

Here is an example where a minor, important modification to the spoken language (exclamation) yields different, correct translations in SignWriting (reflecting the emotion) but the dictionary yields the same one.
Changing to question mark, the face correctly become questioning (even though the SignWriting is not perfect). Timothy Comment: a) can something be minor and important? (small yes, but minor?) Also the sentence is long, complicated and full of difficult vocabulary. Suggestion: Changes in spoken language (e.g., punctuation indicating tone or emotion) yield appropriate translations in SignWriting that reflect context and emotion, while dictionary methods produce static results:

| Text                                                                  | Machine Translation                                                                               | Dictionary Translation                            |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| [Hello world.](https://sign.mt/?spl=en&sil=ase&text=Hello%20world.)   | ![SignWriting for "Hello World." in American Sign Language](assets/hello_world/period.png)        | The sign for "Hello" followed by the sign for "World" |
| [Hello world!](https://sign.mt/?spl=en&sil=ase&text=Hello%20world!)   | ![SignWriting for "Hello World!" in American Sign Language](assets/hello_world/exclamation.png)   | The sign for "Hello" followed by the sign for "World" |
| [Hello world?](https://sign.mt/?spl=en&sil=ase&text=Hello%20world%3F) | ![SignWriting for "Hello World?" in American Sign Language](assets/hello_world/question_mark.png) | The sign for "Hello" followed by the sign for "World" |

## Signed to Spoken Language Translation

Following, is a flowchart of the current translation pipeline from signed to spoken language.

```mermaid
flowchart TD
  A0[Upload Sign Language Video] --> A3[Video]
  A1[Camera Sign Language Video] --> A3
  A3 --> B(Pose Estimation)
  B --> C(<a target='_blank' href='https://github.com/sign-language-processing/segmentation'>Segmentation</a>)
  C & B --> D(<a target='_blank' href='https://github.com/sign-language-processing/transcription'>SignWriting Transcription</a>)
  A2[Language Selector] --> E(<a target='_blank' href='https://github.com/sign-language-processing/signbank-plus'>Spoken Language Text</a>)
  D --> E
  E --> F(Spoken Language Audio)
  E --> G(<a target='_blank' href='https://github.com/sign/translate/issues/19'>Share Translation</a>)
  C -.-> H(Sign Image)


linkStyle 1,2 stroke:orange;
linkStyle 4,5,6 stroke:lightgreen;
linkStyle 3,5,7,10 stroke:red;
linkStyle 0,8,9 stroke:green;
```
