# The Wellbeing Framework – Formulas Glossary

> **CO₂ = Population × (Wellbeing per Capita) × (kWh per Wellbeing Unit) × (CO₂ per kWh)**  
> A planetary accounting identity that replaces GDP with **human and ecological flourishing**.

All equations are **accounting identities** — exact, decomposable, and policy-ready.

---

## 1. **Wellbeing Identity** *(Core Equation)*

$$
\boxed{F = P \times \frac{W}{P} \times \frac{E}{W} \times \frac{F}{E}}
$$

| Term | Meaning | Unit |
|------|--------|------|
| $F$ | CO₂ emissions | Mt CO₂ |
| $P$ | Population | people |
| $\frac{W}{P}$ | **Wellbeing per capita** | WU/person |
| $\frac{E}{W}$ | **Energy intensity of wellbeing** | kWh/WU |
| $\frac{F}{E}$ | **Carbon intensity of energy** | kg CO₂/kWh |

> *Replaces GDP in the Kaya Identity with **W = total societal wellbeing**.*

---

## 2. **W-GS: Wellbeing from Goods & Services**

$$
\boxed{W = \sum_{i=1}^{n} \alpha_i q_i}
$$

| Term | Meaning |
|------|--------|
| $q_i$ | Quantity of social service $i$ (e.g., hospital bed-days, student-years, passenger-km) |
| $\alpha_i$ | Wellbeing weight per unit of $q_i$ (WU per unit) |
| $W$ | **Total social wellbeing** |

> *Example*: 1 hospital bed-day × 0.30 WU/bed-day → contributes 0.30 WU

---

## 3. **W-GSES: + Environmental Services**

$$
\boxed{W = \sum_{i} \alpha_i q_i + \sum_{j} \beta_j e_j}
$$

| Term | Meaning |
|------|--------|
| $e_j$ | Quantity of environmental service (e.g., m³ clean water, tons PM2.5 removed, hectares restored) |
| $\beta_j$ | Wellbeing weight of environmental service |

> *Includes clean air, water, biodiversity, carbon sinks.*

---

## 4. **W-PWRS: + Planetary Resource Stocks** *(Flagship)*

$$
\boxed{
\begin{aligned}
F &= P \times \frac{W_{\text{social}} + W_{\text{env}} + W_{\text{stocks}}}{P} \times \frac{E}{W_{\text{total}}} \times \frac{F}{E} 
W_{\text{total}} &= \sum \alpha_i q_i + \sum \beta_j e_j + \sum \gamma_k s_k
\end{aligned}
}
$$

| Term | Meaning | Example |
|------|--------|--------|
| $s_k$ | **Natural capital stock** | Fish biomass (tons), soil carbon (tons C), freshwater (m³), mineral reserves |
| $\gamma_k$ | Wellbeing weight of stock security | WU per 1M tons sustainable fish |

> *First model to treat **planetary limits as wellbeing inputs**.*

---

## 5. **W-PWRS Dynamics** *(Future)*

$$
\boxed{\frac{d s_k}{dt} = r_k(s_k) - d_k(q_i, e_j) + m_k(\text{management})}
$$

| Term | Meaning |
|------|--------|
| $r_k$ | Natural regeneration (e.g., fish growth) |
| $d_k$ | Depletion from use |
| $m_k$ | Management (e.g., reforestation, recycling) |

> *Coupled human-natural system model.*

---

## 6. **Wellbeing Efficiency Frontier**

$$
\boxed{E/W = \text{kWh per Wellbeing Unit (WU)}}
$$

- **Global target**: **< 5,000 kWh/WU by 2050**
- **Best practice (2025)**: Denmark ~8,000 kWh/WU

---

## 7. **Wellbeing Inequality (Gini)**

$$
\boxed{G_W = \frac{\sum_{i=1}^n \sum_{j=1}^n |W_i - W_j|}{2n^2 \bar{W}}}
$$

- $W_i$ = wellbeing of individual $i$
- **Target**: $G_W < 0.3$ globally

---

## 8. **National Wellbeing Accounts (NWA)**

$$
\boxed{\text{NWA} = P \times \frac{W}{P}}
$$

> *Replaces GDP in national statistics.*

---

## 9. **Corporate Wellbeing Footprint**

$$
\boxed{\text{CWF} = \frac{E_{\text{company}} + E_{\text{supply chain}}}{W_{\text{employees}} + W_{\text{communities}}}}
$$

> *kWh per Wellbeing Unit delivered.*

---

## 10. **Planetary Boundaries Constraint**

$$
\boxed{s_k \geq s_{k,\text{min}} \quad \forall k}
$$

| Boundary | $s_{k,\text{min}}$ |
|--------|------------------|
| Fish stock | > Maximum Sustainable Yield (MSY) |
| Soil carbon | > 1% organic matter |
| Freshwater | > 4,000 km³/year renewable |
| Critical minerals | > 50-year reserve |

---

## 11. Cryptographic Provenance of Wellbeing Data (The Decentralized Trinity Layer)
To ensure planetary resource data ($s_j$) is immutable, uncensorable, and immune to institutional manipulation, all stock variables must pass through a decentralized verification layer using the D-Trinity structure:
$$V_{stock}(t) = \text{SHA-256}\Big(s_j(t) \parallel \text{Nostr}_{relays} \parallel \text{Hash}_{BTC}(t)\Big)$$
Where $$V_{stock}$$ provides the mathematical guarantee of truth for the wellbeing index at time $$t$$.

---

## 12. High-Convexity Pricing of Resource Depletion ($C_{PWRS}$)
To properly penalize the depletion of critical planetary stocks, the framework applies a high-convexity second derivative to energy efficiency, modeling ecological collapse as a financialized tail-risk:
$C_{PWRS} = \frac{1}{W} \frac{\partial^2 W}{\partial E^2}$ 
*This ensures that as energy E usage accelerates towards a planetary boundary, the cost function geometrically explodes.*

---

## Comparison with Doughnut Economics

| Aspect | Doughnut | Wellbeing Framework |
|------|----------|---------------------|
| Form | Diagram | Identity: $F = P \times \frac{W}{P} \times \frac{E}{W} \times \frac{F}{E}$ |
| Energy | Implicit | Explicit: $E/W$ |
| Stocks | Boundaries | Inputs to $W$ |
| Dynamics | Static | $\frac{ds}{dt}$ |

> **Complementary**: Doughnut = destination, Wellbeing = navigation.
> Same goal: thrive within planetary boundaries.  
> Different tools: diagram vs. equation.
> Doughnut: 12 social + 9 ecological thresholds  
> Wellbeing: W = Σ(health + clean air + fish + soil + lithium...)
> Same inputs. But Wellbeing *quantifies* them in WU.

---

## Nomenclature

| Symbol | Definition | Unit |
|-------|-----------|------|
| $F$ | CO₂ emissions | Mt |
| $P$ | Population | people |
| $W$ | Total wellbeing | WU (Wellbeing Units) |
| $E$ | Final energy | TWh or kWh |
| $q_i$ | Social service quantity | e.g., bed-days, km |
| $e_j$ | Environmental service | e.g., m³ water, tons PM2.5 |
| $s_k$ | Resource stock | e.g., tons fish, m³ water |
| $\alpha, \beta, \gamma$ | Wellbeing weights | WU per unit |
| WU | **Wellbeing Unit** | 1 year of dignified, healthy, secure life |

---

## Citation

```bibtex
@misc{ranaora2025wellbeing,
  author       = {Ranaora, Pascal},
  title        = {The Wellbeing Framework: A Planetary Accounting Identity},
  year         = {2025},
  month        = {November},
  howpublished = {\url{https://github.com/MadaGasBit/wellbeing-framework}},
  note         = {Formulas Glossary: formulas.md}
}


