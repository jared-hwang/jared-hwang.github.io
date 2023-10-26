---
title: "Urban Inference: Applying Simulation Inference to Traffic Simulations"
collection: projects
type: "Projects"
permalink: /projects/traffic_sim_inference/
thumbnail: /images/project_thumbs/posterior.png
thumbnail_alt: "Posterior over the three traffic signal parameters tuned in the project"
venue: "University of Southern California (USC)"
date: 12/2021  # end date
daterange: Nov 2021 - Dec 2021 
location: "Los Angeles, California"
supervisor: "Prof. Aiichiro Nakano"
excerpt: "Applying Bayesian conditional density estimation simulation inference to traffic simulations of the Seattle area."
---

In simulation-based inference, a simulator is described by a joint distribution over the output (x) and some latent variables (x), conditioned on the input parameters (θ).

`p(x, z | θ) = p(x | z, θ) p(z | θ)`

We can attempt to learn the relationship between the output and the input parameters, to make future predictions about the impact of the input parameters on the output of the simulation (without having to run the simulation).

| ![traffic_sim.gif](/images/project_images/traffic_sim.gif) | 
|:--:| 
| *Traffic Simulation run in the A/B Street UI* |

We use the open source software A/B Street for its straightforward API, and performed simulation inference on traffic simulations of the Montlake area in Seattle. 

We find that shorter or longer interval times of traffic lights can lead to shorter or longer trip times overall on average, according to our learned relationship.

| ![posterior.png](/images/project_thumbs/posterior.png) | 
|:--:| 
| *Posterior over the three traffic signal parameters, conditioned on baseline travel duration; p(θ \| x<sub>o</sub>)* |

More about the project methodology and results can be seen at the project page, [here](https://github.com/jared-hwang/UrbanInference).

