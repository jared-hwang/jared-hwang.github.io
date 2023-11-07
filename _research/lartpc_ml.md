---
title: "Machine Learning on Liquid Argon Time Projection Chamber (LArTPC) images"
collection: research
type: "Research"
permalink: /research/lartpc_ml/
thumbnail: /images/research_thumbs/instancesegthumbnail.png
thumbnail_alt: "Thumbnail of Liquid Argon Time Projection Chamber image segmentation"
venue: "Tufts University"
daterange: May 2020 - Sep 2021
date: 09/2021
location: "Medford, Massachusetts"
supervisor: "Prof. Taritree Wongjirad"
excerpt: "Building tools with ML for analyzing neutrino detector images from a Liquid Argon Time Projection Chamber. Using a VQVAE to compress large image files, and performing instance segmentation on the LArTPC images to extract neutrino trails."
---

Liquid argon time projection chambers (LArTPCs) are a type of particle detector used in neutrino experiments. To make the most of the detector data, we must reconstruct and identify particle paths through the detector accurately. The [Neutrino Group at Tufts University](https://sites.tufts.edu/nutufts/) explores the [use of deep neural networks](https://sites.tufts.edu/nutufts/projects/lartpc-reconstruction-with-deep-convolutional-neural-networks/) to reconstruct particle interactions.


**Project 1: Attempting centroid based instance segmentation on LArTPC images**

To separate the different elements of a neutrino interaction (trunk, shower, etc.), we attempt to use a novel centroid based loss-function to perform instance segmentation. See the loss function paper [here](https://arxiv.org/abs/1906.1110).

| ![instanceseg.png](/images/research_images/lartpc/instanceseg.png) | 
|:--:| 
| *The ground truth of instance segmentation in our project. Note the shower is missing from the highlight, a problem with the labeling upstream.* |

Unfortunately, application of the technique gave poor results for LArTPC data, possibly due to the vastly different shape of objects in the dataset. 

**Project 2: Compressing LArTPC images using Autoencoders**

LArTPC detectors produce terabytes of data per second. Finding a way to make these images smaller would vastly decrease cost and increase flexibility and convenience of analysis. Using a VQVAE (Vector Quantized Variational Autoencoder), we can learn a latent space for the LArTPC images and interactions, train an encoder and decoder, and save just the encoded images. At analysis, we then can apply the decoder. 

By tiling LArTPC images into VQVAE-acceptable image sizes, and reconstructing decoded tiles, we achieved up to 80% reduction in file size compared to traditional JPEG compression. 

| ![instanceseg.png](/images/research_images/lartpc/reconstructedtiles.png) | 
|:--:| 
| *An example of tiles compressed and reconstructed using the VQVAE. Top is the original images, bottom is the reconstructed.* |