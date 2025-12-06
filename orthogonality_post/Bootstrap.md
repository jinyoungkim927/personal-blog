#data-science 

**Battle tips**
- Disaster when [[High Dimensional Statistics]] setting with low samples. [[Bootstrap]] interpolates data in a very random fashion. 
- Relies on Edgeworth expansion
- High dimensional regression coefficient is far from the truth 
### What is it: 
- Creating multiple random samples of the target variable from an existing model's predictions - sampling through replacement
- Helps you assess robustness of model by generating variations in training data, simulating different 'worlds' of predictions
- When bootstrapping labels from a model that has undergone cross-validation, essentially asking whether this variability helps the linear regression generalize well to unseen data. 
- When thinking about bias variance tradeoff: 
	- Bootstrapping tends to reduce variance, making the model less sensitive to quirks in original data 
	- Can reduce overfitting / increase generalization
	- Will perform well on validation set, especially if the bootstrapped labels represent target distribution without too much noise

