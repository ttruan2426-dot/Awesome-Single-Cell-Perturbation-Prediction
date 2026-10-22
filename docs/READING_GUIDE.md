# Reading guide

## Choose a task

- **State representation learning:** cell and gene embeddings, multimodal alignment, reconstruction and transfer learning.
- **Perturbation-response prediction:** outcomes conditioned on an intervention, including molecular profiles, populations, dynamics and spatial responses.
- **Intervention discovery and design:** identifying or generating interventions for a requested outcome. Subgroups cover retrieval and target prioritization, direct inverse prediction, predictor-guided search, conditional generation, and closed-loop experiment selection.

## Follow connections between tasks

STATE and Stack combine representation pretraining with response learning and are listed under response prediction. Geneformer is listed under representation learning, with its downstream in silico intervention analysis indicated as a related task. PertMind is listed under response prediction and also includes reverse perturbation identification. CellNavi and PDGrapher are listed under intervention design, with related representation or forward-prediction tasks indicated in their entries.

The design section includes PAIRING and TwinCell for retrieval or prioritization; CellNavi and PDGrapher for direct inverse prediction; Morpheus and PHAROS for predictor-guided search; and CURE for conditional molecule generation. BacterAI and active intervention design are listed separately as closed-loop experiment-selection examples.

## Read computational labels

T: Transformer; G: graph neural network; D: diffusion or flow matching; L: latent generative model; S: statistical or mathematical method; A: agentic or agent-based component; N: other architecture. Multiple labels indicate combined components.

RNA, ATAC, DNA, Protein and Spatial describe measured information. Task categories describe what a method is used to compute. A method may combine computational components and connect several tasks.

## Find supporting resources

Experimental assays and data resources cover cell atlases, perturbation screens, paired measurements and spatial assays. Benchmarks and evaluation include evaluation studies, baselines and community challenges. Background reviews and additional resources provide further reading.
