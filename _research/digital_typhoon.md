---
title: "Machine Learning for the Digital Typhoon Dataset"
collection: research
type: "Research"
permalink: /research/digital_typhoon/
thumbnail: /images/research_thumbs/typhoon_thumb.jpg
thumbnail_alt: "Thumbnail of image of typhoon"
venue: "National Institute of Informatics (NII)"
daterange: Jan 2023 - Aug 2023
date: 08/2023
location: "Tokyo, Japan"
supervisor: "Prof. Asanobu Kitamoto" 
excerpt: "Preparing, publishing, and using the Digital Typhoon Dataset for machine learning. The dataset is the longest typhoon satellite image dataset available. We developed ways to interact with the dataset for ML, and performed benchmarks in analysis, reanalysis, and forecasting."
---

The Digital Typhoon Project aims to collect, standardize, and curate typhoon (hurricane) satellite images in the Western North Pacific. It was started in 1997, and the Digital Typhoon Dataset covers over 40 years from 1978 to 2023 -- the longest typhoon satellite dataset available. 

With the dataset, the project hopes to reduce the burden of researchers to begin peforming ML on tropical cyclones without needing in depth meteorology and satellite remote sensing knowledge.

| ![typhoon_overview.png](/images/research_images/digital_typhoon/typhoon_overview.png) | 
|:--:| 
| *An overview of the dataset and projection of globe images to 2D.* |



**Releasing the Dataset: the Last Mile**

Before I joined the project, the dataset existed only as part of a browsable UI on the [Digital Typhoon website](http://agora.ex.nii.ac.jp/digital-typhoon/). It wasn't an ML-ready dataset:

1. There was no organized file structure. No defined delineation of seasons (years), typhoon sequences, etc. 
2. No way to interact with the dataset in a controlled manner
    * Loading into a program isnt as simple as reading in all the images and labels
    * Without thoughtfully splitting the dataset into test/train/validation sets, leakage could occur between sequences and years
    * How to link ground truth data to images? The ground truth is taken from best track data, which doesn't line up 1:1 to the satellite images
    * Doing engineered splits, such as splitting between satellite generations
3. We had no benchmarks as to how well the dataset worked with current ML models

The result was a highly valuable dataset only accessible via the web UI, which many people scraped to access, resulting in ML models trained off of lossly compressed JPEG images with potential graphical artifacting, and non-standardized. 

**pyphoon2**

| ![typhoon_data_dir_structure.png](/images/research_images/digital_typhoon/typhoon_data_dir_structure.png) | 
|:--:| 
| *An overview of the structure of the dataset* |

To cover the last mile and make the Digital Typhoon Dataset an easily downloadable dataset with a fast download-to-ML turnaround time, I developed `pyphoon2`, a PyTorch dataloader which offers:

1. Automatic reading and loading of the data into sequence objects, with ground truth labels accessible via object attributes
2. Hands-off random splitting by image, sequence, or season
3. Filtering, transforms, and selection by any label attribute
4. Interpolation and dataset modification
5. All the flexibility of PyTorch, making using the dataset "plug and play"

You can find pyphoon2 [here](https://github.com/kitamoto-lab/pyphoon2).

**Benchmarking**

I also led the benchmarking efforts between myself and the two other students on the project. We defined three tasks applicable to the dataset and developed models to address all three:

1. Analysis
2. Forecasting
3. Reanalysis

You can see the definitions and our results in our paper, where we published the benchmarks and dataset to the NeuRIPS 2023 Datasets and Benchmarks track: 

_Digital Typhoon: Long-term Satellite Image Dataset for the Spatio-Temporal Modeling of Tropical Cyclones_ [[pdf]](/files/digital_typhoon_neurips.pdf)

Or browse the Digital Typhoon [website](http://agora.ex.nii.ac.jp/digital-typhoon/). 




