# Testes de Sistemas Distribuídos — Processamento Sequencial e Paralelo

## 1. Resultados dos testes

Foram realizados três testes para cada quantidade de tarefas: 30, 100 e 300. Em cada execução, foram comparados os tempos do processamento sequencial e paralelo.

### Testes com 30 tarefas

| Execução | Sequencial (ms) | Paralelo (ms) | Speedup |
|---|---:|---:|---:|
| 1 | 1206,89 | 1001,63 | 1,20x |
| 2 | 1202,46 | 899,22 | 1,34x |
| 3 | 1189,11 | 886,84 | 1,34x |
| **Média** | **1199,49** | **929,23** | **1,29x** |

### Testes com 100 tarefas

| Execução | Sequencial (ms) | Paralelo (ms) | Speedup |
|---|---:|---:|---:|
| 1 | 3788,70 | 1931,46 | 1,96x |
| 2 | 3961,10 | 1924,08 | 2,06x |
| 3 | 3914,82 | 1787,46 | 2,19x |
| **Média** | **3888,21** | **1881,00** | **2,07x** |

### Testes com 300 tarefas

| Execução | Sequencial (ms) | Paralelo (ms) | Speedup |
|---|---:|---:|---:|
| 1 | 11943,48 | 4615,97 | 2,59x |
| 2 | 11416,93 | 4366,14 | 2,61x |
| 3 | 11310,85 | 4333,55 | 2,61x |
| **Média** | **11557,09** | **4438,55** | **2,60x** |

## 2. Comparação geral

| Tarefas | Speedup médio | Redução aproximada do tempo |
|---|---:|---:|
| 30 | 1,29x | 22,5% |
| 100 | 2,07x | 51,6% |
| 300 | 2,60x | 61,6% |

## 3. Conclusão

Em todas as quantidades testadas, o processamento paralelo apresentou menor tempo de execução que o sequencial. O melhor resultado foi obtido com 300 tarefas, com speedup médio de 2,60x e redução aproximada de 61,6% no tempo de processamento.
