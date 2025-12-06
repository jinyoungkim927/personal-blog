#personal #insights #mathematics #linear-algebra #philosophy 

Work has recently made me think a lot about the concept of '[[Orthogonality]]'. It's helped me iterate on some of my personal beliefs: 

1. Understand your blind ~~spots~~ dimensions. 
2. Take ~~more~~ different risks
3. Nurture your ~~unique~~ orthogonal gifts

First, what does orthogonality, the state of two vectors being *orthogonal*, mean? Here are some definitions that get increasingly less precise but more intuitive. 

Two vectors  $u$ and $v$ are orthogonal if...

1. Their [[Inner Product]] is zero: $\langle u, v \rangle = 0$ 
2. They meet at a right angle
3. They are maximally independent, meaning knowing something about one tells you absolutely nothing about the other https://www.datcreativity.com
4. One represents genuinely new information that expands what the space can express with the other 

## 1. Understand your blind dimensions. 

> The little quail laughs at him, saying, “Where does he think he’s going? I give a great leap and fly up, but I never get more than ten or twelve yards before I come down fluttering among the weeds and brambles. And that’s the best kind of flying, anyway! Where does he think he’s going?” Such is the difference between big and little.
> - Zhuangzi

How would you model the collection of your thoughts? 

The most natural model to me feels like a high dimensional space, where each point represents a single thought. In a similar way to how embeddings like CLIP https://openai.com/index/clip/ represent abstract dimensions, I don't know what these dimensions intuitively 'mean' or are, but since we all eat and poop, I imagine some dimensions are highly correlated with those concepts. 

CODE SNIPPET 1:
TO GENERATE NICE PLOT OF 4D SPACE AND VECTORS AND ONE OF 3D SPACE AND VECTORS

Ok, so then, how does communication work? One observation is we know communication happens, so our thoughts must have a pretty good low rank approximation, i.e. they can be projected down to a shared dimension without losing too much information. 

CODE SNIPPET 2:
PROJECT FROM 3D onto 2D PLANE (print and suggest some dialogue)

But what about moments of major miscommunication? When we bicker with loved ones about the intentions of our words? Or when a teacher has explained something to you that completely went over your head? These to me are like noisy projections or projections onto a rotated basis. That's why we can partially understand each other while missing nuances, or the orthogonal components in each of our thoughts. 

CODE SNIPPET 3:
2 vector projecting onto each other. 

What orthogonality highlights, though, is that the nuance we miss, the orthogonal component the projection doesn't capture, is that it's not a blind spot. It's not a part of your car you can't see when you're backing out. It's a whole dimension. The above passage from Zhuangzi makes me think of this idea powerfully. For a quail, it doesn't understand the Peng that is flying for thousands of kilometres in the sky. There are things that completely fly past our heads. To a consciousness confined to a subspace, an orthogonal vector is invisible.

And once we consider our ignorance not in terms of little patches to uncover, but entire dimensions to discover, it's quite scary. Just to give a taste as to why this scary all sorts of other reasons, consider the curse of dimensionality. If we assume that our thoughts are roughly uniformly distribute across higher dimensions, the distance between them explodes evenly (interestingly why high-dimensional [[Bootstrap]] methods fail). This explains why thinking from even a couple more perspectives than what we usually do feels so much more taxing. 

The only way to reduce this is to i) feel orthogonal moments, and ii) add a basis vector as a result. In my model so far, this is impossible. But we know this isn't the case. Teachers - titled and not - can guide us to seeing things in ways that we have never seen before. After all, mathematically, discovering new dimensions is trivial—you just need a single example that can't be expressed as a linear combination of your basis vectors. One counterexample immediately proves the new dimension exists.The real problem isn't that orthogonal dimensions are _undetectable_—it's that without encountering them, you have no reason to suspect they exist. 

This makes me feel in awe at the complexity, depth and mysticism of the world.

## 2. Take different risks: 

First, a quick overview on why independent bets are great. Suppose you have a bet with expected value $\mu$ and variance $\sigma^2$. If you take $n$ independent identical bets, the [[Central Limit Theorem]] tells us:

- Your total expected value scales linearly: $n\mu$
- Your total variance scales linearly: $n\sigma^2$
- But your _standard deviation per unit expectation_ scales as $\sqrt{n}$

This means taking more of the same bet gives you $\sqrt{n}$ times better risk-adjusted returns, which is pretty neat. 

Now consider taking bets on _uncorrelated_ outcomes. This is where [[Portfolio Theory]] becomes powerful. Let $\mathbf{w} = (w_1, w_2, \ldots, w_n)^T$ be your portfolio weights (where $\sum w_i = 1$), $\mathbf{r} = (r_1, r_2, \ldots, r_n)^T$ be the vector of asset returns, and $\Sigma$ be the covariance matrix where $\Sigma_{ij} = \text{Cov}(r_i, r_j)$.

Portfolio variance becomes: $$\sigma_p^2 = \mathbf{w}^T \Sigma \mathbf{w} = \sum_{i=1}^n \sum_{j=1}^n w_i w_j \sigma_{ij}$$Expected return is simply: $$\mu_p = \mathbf{w}^T \boldsymbol{\mu}$$
The diagonal terms $w_i^2 \sigma_i^2$ represent each asset's individual risk contribution—these scale with the square of your allocation.

But the off-diagonal terms $2w_i w_j \rho_{ij} \sigma_i \sigma_j$ are where diversification happens. With $n$ assets, you have $n$ diagonal terms but $\frac{n(n-1)}{2}$ off-diagonal terms. As $n$ grows large, the off-diagonal correlations dominate. If correlations are low, adding more assets drives portfolio variance toward zero even while maintaining positive expected returns. You get the numerator (returns) without the denominator (risk).

The critical insight is in the off-diagonal terms: $2w_i w_j \rho_{ij} \sigma_i \sigma_j$. When assets are _orthogonal_($\rho = 0$), these terms vanish entirely—you get pure variance reduction with no interference. But when $\rho > 0$, these positive cross-terms _add_ to your total variance, contaminating the diversification benefit.

The mathematical beauty: with $n$ assets, you have $n$ variance terms but $\frac{n(n-1)}{2}$ correlation terms. As $n$ grows, the correlations increasingly dominate the portfolio variance. If those correlations are near zero (orthogonal dimensions), your portfolio variance shrinks as $\frac{\bar{\sigma}^2}{n}$—you get the law of large numbers working for you. But if $\rho$ is high across all pairs, you're essentially holding one asset in $n$ different wrappers.

Orthogonality isn't just helpful—it's the _only_ thing that makes diversification work. Without it, $\mathbf{w}^T \Sigma \mathbf{w}$ doesn't shrink as you add dimensions; it stays stubbornly high because the covariance matrix remains rank-deficient in the effective dimension space.

I'm a bit obssessed about data. For the last two years, I've been scoring 12 features that overall contribute to my life's goals and satisfaction levels every two weeks. These are:

```python
['AI key info', 'Adventure & Creativity', 'Career & Work', 'Character & Identity', 'Contribution and Impact', 'Education & Skill Development ', 'Emotions & Well-Being', 'Health & Fitness', 'Location & Tangibles', 'Money & Finances', 'Productivity & Organization', 'Social Life & Relationships', 'Sum', 'Thoughts', 'Values and Purpose']
```

So, which of these features are orthogonal?
![[correlation_matrix.png]]
I've been tracking six life dimensions fortnightly since 2023, and the data reveals both what I've done right and my biggest remaining vulnerability. The wins: I've successfully reduced my life's volatility—my well-being swings have compressed from 5-point ranges in 2023-24 to ~3.7 points in 2025—by diversifying into fitness (triathlon training), relationships (Fran), and creative work (writing). When my career crashed in fall 2024 (no DESCO offer, identity score plummeted to 2), my learning dimension actually _improved_ to 7-9, proving orthogonality works: uncorrelated bets provide natural hedges. But here's the glaring failure: career still explains 65% of my well-being variance (ρ = 0.81 with overall satisfaction), and Contribution & Impact sits at 1—essentially a neglected asset with near-zero correlation to everything else. The math is screaming at me: investing heavily in contribution (The Anti-Racism Kit, the networking dinners, public writing) would provide massive diversification benefits because it's orthogonal to whether Two Sigma is going well or Fran is in town. I've been good at building moderately correlated dimensions (relationship, fitness, creativity all ρ ≈ 0.4-0.6 with career), but I've completely ignored the one dimension that could genuinely stabilize my portfolio. The strategic move isn't to grind harder at work or optimize my relationship further—it's to bring that 1 up to a 6, which would reduce my overall volatility by ~20% while adding a source of meaning that doesn't crash when my performance review disappoints or my deadlift plateaus.

# 3. Nurture your orthogonal gifts

> Come mothers and fathers  
> Throughout the land  
> And don't criticize  
> What you can't understand  
> ...  
> For the times they are a-changin'  
> — Bob Dylan, "The Times They Are A-Changin'"

Link spotify bob dylan https://open.spotify.com/track/52vA3CYKZqZVdQnzRrdZt6?si=eedf21b068d943e8 from 1:47 to 2:20

What makes you special?

A lot of what I do is in search of an answer to this. People use the word unique a lot in this vein, but I think it's unhelpful. Most of the time (through the selection bias of communication), unique means choosing a dimension that people already care about and being an outlier of sorts. The Michael Jordan of basketball. The T.S. Eliot of poetry. 

But a lonelier, but a more valuable path for the world, is to be orthogonal. But because it's something that is truly unique, many people will miss it. They might just perceive whatever projection they can interpret as weird, or alien. 

But I believe this orthogonal component - in finance what traders call intuition, the residuals of quants models - is the magic stuff that data misses. The fragile wisp of individuality of childlike wonder that gives us all the gift of contributing and participating in the world. What's magical about orthogonality is also that the right combination of existing vectors can make you very uncorrelated, and in an unstable sense, orthogonal too. 

Where do you see beauty where others don't? Where is complexity in what others trivialise? What is a knack you have for which a single word doesn't capture it?

In conjunction with the second point, I believe these orthogonal traits are what contribute to the world. The world has existing components that can perform certain tasks, make certain types of impacts. Adding or subtracting magnitude on an existing vector is capped because it does not raise the 'efficient frontier' of humanity. And in the same way comparing orthogonal vectors is like comparing apples and oranges, there is no single metric for ranking these talents.

I think about this a lot, in reference to the name of my blog post. We live in a world that is on the cusp of cataclysm or rebirth. The second coming (https://www.poetryfoundation.org/poems/43290/the-second-coming) is here. And we need to rethink the notion of usefulness dramatically. We will need artists. My gripe with utilitarian rhetoric on ethics like 80k hours (while being net positive for the world) is that it is unaware of orthogonality. A world without artists is flatter. Flatter on the order of several dimensions. 
