# Teachatbot

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.

## Messages from Api.ai

#### video

custom payload that contains

> type: must be "video"

> platform: must be "vimeo"

> id: number at the end of the url when on a video on vimeo

#### MCQ

custom payload that contains

> type: must be "exercise"

> exotype: must be "mcq"

> wording: the wording of the problem

> choices: array of choices like [ "answer 1", "answer 2", ...  ]

> answer: the index of the right choice in the array of choices. For example if the riight answer is "answer 2", the index must equal 1 (indexes start at 0)

> explanation: a text displayed to explained the exercise in detail once the student has answered
