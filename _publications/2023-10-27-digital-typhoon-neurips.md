---
title: "Digital Typhoon: Long-term Satellite Image Dataset for the Spatio-Temporal Modeling of Tropical Cyclones"
collection: publications
selected: true
permalink: /publication/2023-10-27-digital-typhoon-neurips
date: 2023-10-27
venue: 'NeuRIPS ’23 Dataset and Benchmarks Track'
acceptance_rate: '32.6% (322 / 987)'
award: 'spotlight'
link: '/files/digital_typhoon_neurips.pdf'
authors: Asanobu Kitamoto, <b>Jared Hwang</b>, Bastien Vuillod, Lucas Gautier, Yingtao Tian, Tarin Clanuwat
thumbnail: /images/publications/digitaltyphoon.jpg
paperurl: 'https://arxiv.org/abs/2311.02665'
code: 'https://github.com/kitamoto-lab/digital-typhoon/'
doi: 'https://dl.acm.org/doi/10.5555/3666122.3667890'
arxiv: 'https://arxiv.org/abs/2311.02665'
research_project: digital_typhoon
# citation: 'Digital Typhoon: Long-term Satellite Image Dataset for the Spatio-Temporal Modeling of Tropical Cyclones
# Asanobu Kitamoto, Jared Hwang, Bastien Vuillod, Lucas Gautier. NeuRIPS – Conference on Neural Information Processing Systems, 2023.'
---

This paper presents the official release of the Digital Typhoon dataset, the longest typhoon satellite image dataset for 40+ years aimed at benchmarking machine learning models for long-term spatio-temporal data. To build the dataset, we developed a workflow to create an infrared typhoon-centered image for cropping using Lambert azimuthal equal-area projection referring to the best track data. We also address data quality issues such as inter-satellite calibration to create a homogeneous dataset. To take advantage of the dataset, we organized machine learning tasks by the types and targets of inference, with other tasks for meteorological analysis, societal impact, and climate change. The benchmarking results on the analysis, forecasting, and reanalysis for the intensity suggest that the dataset is challenging for recent deep learning models, due to many choices that affect the performance of various models. This dataset reduces the barrier for machine learning researchers to meet large-scale real-world events called tropical cyclones and develop machine learning models that may contribute to advancing scientific knowledge on tropical cyclones as well as solving societal and sustainability issues such as disaster reduction and climate change. The dataset is publicly available at this http [URL](https://agora.ex.nii.ac.jp/digital-typhoon/dataset/) and this https [URL](https://github.com/kitamoto-lab/digital-typhoon/). 