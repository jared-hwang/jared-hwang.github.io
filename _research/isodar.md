---
title: "Isotope Decay at Rest Experiment (IsoDAR)"
collection: research
type: "Research"
permalink: /research/isodar/
thumbnail: /images/research_thumbs/rfqthumb.png
thumbnail_alt: "Thumbnail of RFQ simulation visualization"
venue: "Massachusetts Institute of Technology (MIT)"
date: 03/2020  # end date
daterange: Jun 2018 - March 2020 
location: "Cambridge, Massachusetts"
supervisor: "Prof. Janet Conrad"
excerpt: "Developing a simulation code from the ground up for Radio Frequency Quadrupoles (RFQs). Designed to support existing simulation infrastructure, accurately simulate space-charge (interaction between charged particles), and parallelization. Faster and more scientifically accurate than existing alternatives!"
---

The IsoDAR experiment searches for sterile neutrino oscillations and non-standard neutrino interactions. Once built, the IsoDAR accelerator will send dihydrogen molecules through a **radio frequency quadrupole** (RFQ), then a cyclotron, to then impinge onto a Be and Li target, producing antineutrinos that we detect and can study. 

To predict the behavior of the H<sub>2</sub>+ through the RFQ, we simulate it. 

| ![rfq.gif](/images/research_images/isodar/rfq.gif) | 
|:--:| 
| *Video of an RFQ simulation* |

**The Problem**

All RFQ simulation software at the time had at least one problem:

1. By not simulating space-charge (interaction between charged particles) it was inaccurate.
2. It was proprietary.
3. It didn't play well with other software (such as the input and output of other particle accelerator elements), and was difficult to use and tune. 
4. It was slow

**The Solution**

I developed PyRFQHelper, an RFQ simulation software from the ground up designed to solve those problems and more. To address the issues:

1. It's built on top of WARP, a particle-in-cell simulation framework that takes space-charge into account. 
2. It's built open-source. 
3. It's built to accept a wide variety of input data forms and output a simple format. 
4. Despite already being faster, we integrated parallel-processing capability. 

In addition, it:

* Visualizes simulation results 
* Automatically calculates statistics of interest (emittance, electric field, etc.)
* Uses clustering to determine particle bunch size and statistics at simulation end

Simulations were also easily customizable (being built on top of WARP), so new components in different shapes could easily be added or removed from the simulation.

**Results**

A simulation software that performs as fast, and with parallelization, faster than competing software, that's flexible and scientifically accurate. 

More about IsoDAR can be read [at the website](https://www.nevis.columbia.edu/daedalus/) or in the [paper](https://arxiv.org/abs/1307.5081). 

Project code can be found [here](https://github.com/DanielWinklehner/PyRFQ). 
