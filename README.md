# Rerender with data

| Before                                                                                                |                       After                       |
| :---------------------------------------------------------------------------------------------------- | :-----------------------------------------------: |
| ![BeforeFirstRender](./docs/1.png)                                                                    |                                                   |
| **Render**: 329.9ms<br>**Committed at:** 1s<br>**Passive effects**: 27s<br>**Layout effects**: <0.1ms |                         -                         |

# Use sorting

| Before                                                                                                     |                  After                   |
| :--------------------------------------------------------------------------------------------------------- | :--------------------------------------: |
| ![BeforeSored](./docs/2.png)                                                                               |                                          |
| **Render**: 315.5ms<br>**Committed at:** 8.4s<br>**Passive effects**: 25.2ms<br>**Layout effects**: <0.1ms |                    -                     |

# Use filter year

| Before                                                                                                     |                      After                      |
| :--------------------------------------------------------------------------------------------------------- | :---------------------------------------------: |
| ![BeforeFilter](./docs/3.png)                                                                              |                                                 |
| **Render**: 322.2ms<br>**Committed at:** 4.7s<br>**Passive effects**: 34.2ms<br>**Layout effects**: <0.1ms |                        -                        |

# Use search (value = "f" )

| Before                                                                                                     |                    After                    |
| :--------------------------------------------------------------------------------------------------------- | :-----------------------------------------: |
| ![BeforeSearchF](./docs/4.png)                                                                             |                                             |
| **Render**: 27.4ms<br>**Committed at:** 2.8s<br>**Passive effects**: 0.3ms<br>**Layout effects**: <0.1ms   |                      -                      |

# Add new column for table

| Before                                                                                                    |                   After                   |
| :-------------------------------------------------------------------------------------------------------- | :---------------------------------------: |
| ![BeforeNewCol](./docs/5.png)                                                                             |                                           |
| **Render**: 366.6ms<br>**Committed at:** 4.6s<br>**Passive effects**: 3.9ms<br>**Layout effects**: <0.1ms |                     -                     |
