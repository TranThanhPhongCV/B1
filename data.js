window.QUIZ_DATA = {
  tests: [
    {
      id: "test1",
      title: "Test 1",
      sections: [
        {
          id: "reading",
          title: "Reading",
          icon: "📖",
          parts: [
            {
              id: "part1",
              title: "Part 1",
              description: "Các thông báo/tin nhắn ngắn — Chọn câu giải thích đúng nhất ý nghĩa của thông báo.",
              type: "abc",
              questions: [
                {
                  id: "t1-r-p1-q1",
                  stem: "STUDENTS! YOUR 6€ DEPOSIT FOR LOCKER KEYS WON'T BE REFUNDED IF KEYS ARE LOST.",
                  options: [
                    "Lost locker keys can be replaced for a charge of 6€.",
                    "You cannot collect your locker key until you have paid a 6€ deposit.",
                    "We cannot return your 6€ deposit if you lose your locker key."
                  ],
                  answer: 2
                },
                {
                  id: "t1-r-p1-q2",
                  stem: "Jo, Can you get me a 'Fast Boys' T-shirt from their concert tomorrow? I like the purple ones, but another colour's OK if they haven't got one in my size. Thanks Hannah.",
                  options: [
                    "Hannah has got a purple 'Fast Boys' T-shirt and wants one in another colour.",
                    "Hannah would rather have a purple 'Fast Boys' T-shirt if possible.",
                    "Hannah only wants a 'Fast Boys' T-shirt if it's a purple one."
                  ],
                  answer: 1
                },
                {
                  id: "t1-r-p1-q3",
                  stem: "3.30pm Class 5 Garden Party 17 July. Because of bad weather, tomorrow's party will now be in the School Hall. Please give party food and drink to Mrs Bloom by 11am. What has changed about Class 5's party?",
                  options: [
                    "the time",
                    "the place",
                    "the refreshments"
                  ],
                  answer: 1
                },
                {
                  id: "t1-r-p1-q4",
                  stem: "Becky, Don't forget your Aunt Jane's coming to stay tonight, so can you make sure the house is neat when you go out this afternoon? Mum. Mum is writing to",
                  options: [
                    "tell Becky to stay at home to see her aunt.",
                    "ask Becky to tidy the house before she leaves.",
                    "remind Becky to go to her aunt's house."
                  ],
                  answer: 1
                },
                {
                  id: "t1-r-p1-q5",
                  stem: "School Fitness Centre. From the end of August, the fitness centre will be closed during the weekends and evenings. The school fitness centre will",
                  options: [
                    "change its opening hours at the end of August.",
                    "have shorter opening hours until the end of August.",
                    "open again to students at the end of August."
                  ],
                  answer: 0
                }
              ]
            },
            {
              id: "part2",
              title: "Part 2",
              description: "Ghép mô tả người với khoá học phù hợp (A–H). Mỗi chữ cái chỉ được dùng một lần.",
              type: "matching",
              options: [
                { id: "A", label: "A. Wild Art" },
                { id: "B", label: "B. Colourscape" },
                { id: "C", label: "C. Create!" },
                { id: "D", label: "D. Art Attack" },
                { id: "E", label: "E. Art Matters" },
                { id: "F", label: "F. Art Magic" },
                { id: "G", label: "G. Arts Centre" },
                { id: "H", label: "H. Rainbow" }
              ],
              questions: [
                {
                  id: "t1-r-p2-q6",
                  stem: "Alice wants a course to help her with her drawing skills, particularly with drawing the latest styles of clothes, shoes and bags, because she wants to study this later at college.",
                  answer: "E"
                },
                {
                  id: "t1-r-p2-q7",
                  stem: "Darius loves making comic books, but isn't confident about his drawing. He wants to draw superheroes and animals and create adventures about them, but doesn't want to display his work.",
                  answer: "C"
                },
                {
                  id: "t1-r-p2-q8",
                  stem: "Cassie enjoys making pictures and objects from different materials. During the course she'd like to use her love of sport in her designs, and visit an exhibition to get new ideas.",
                  answer: "B"
                },
                {
                  id: "t1-r-p2-q9",
                  stem: "Marc is talented at drawing, but also likes filming his friends on an old digital camera. He wants to develop this skill by learning to use more advanced equipment, and prepare for further study.",
                  answer: "D"
                },
                {
                  id: "t1-r-p2-q10",
                  stem: "Harry has done a course about printing on paper, and would like to learn how to print on other materials. He also wants to produce something to take home and wear.",
                  answer: "H"
                }
              ]
            },
            {
              id: "part3",
              title: "Part 3",
              description: "Đọc đoạn văn về Paul và chuyến đi New Zealand. Chọn A (Correct) hoặc B (Incorrect).",
              type: "truefalse",
              options: [
                { id: "A", label: "A. Correct" },
                { id: "B", label: "B. Incorrect" }
              ],
              questions: [
                { id: "t1-r-p3-q11", stem: "Paul has family connections with the place he first visited in New Zealand.", answer: "A" },
                { id: "t1-r-p3-q12", stem: "Paul and his family chose to go to Kaikoura as part of their tour.", answer: "B" },
                { id: "t1-r-p3-q13", stem: "As soon as Paul arrived in Kaikoura he knew he might see some dolphins there.", answer: "B" },
                { id: "t1-r-p3-q14", stem: "The weather got worse during Paul's boat trip.", answer: "B" },
                { id: "t1-r-p3-q15", stem: "Paul had expected to go swimming closer to land.", answer: "A" },
                { id: "t1-r-p3-q16", stem: "Paul was beginning to feel unhappy about the trip until someone saw the dolphins.", answer: "A" },
                { id: "t1-r-p3-q17", stem: "Paul believed the dolphins were inviting him to join them in the water.", answer: "A" },
                { id: "t1-r-p3-q18", stem: "Paul felt that he had failed to communicate with the dolphins.", answer: "B" },
                { id: "t1-r-p3-q19", stem: "One dolphin copied exactly what Paul did in the water.", answer: "B" },
                { id: "t1-r-p3-q20", stem: "Paul was pleased when the guides finally called them back onto the boat.", answer: "A" }
              ]
            },
            {
              id: "part4",
              title: "Part 4",
              description: "Đọc bài luận của Jessica về phim James Bond. Chọn đáp án đúng A, B, C hoặc D.",
              type: "abcd",
              questions: [
                {
                  id: "t1-r-p4-q21",
                  stem: "What is Jessica trying to do in her essay?",
                  options: [
                    "explain what first attracted her to Bond films",
                    "tell readers about the Bond DVDs she owns",
                    "give a balanced view of a Bond film she has seen",
                    "describe how Daniel Craig got the part of James Bond"
                  ],
                  answer: 2
                },
                {
                  id: "t1-r-p4-q22",
                  stem: "What can a reader find out from Jessica's essay?",
                  options: [
                    "whether Quantum of Solace is her favourite Bond film",
                    "what other films Daniel Craig has made",
                    "which other actors have played James Bond",
                    "whether she thinks Daniel Craig is the best James Bond"
                  ],
                  answer: 3
                },
                {
                  id: "t1-r-p4-q23",
                  stem: "What does Jessica tell us about Craig in the new Bond film?",
                  options: [
                    "He performs some of the action scenes.",
                    "He wears some stylish clothes.",
                    "He is given a lot of lines to say.",
                    "He looks strong and fit enough to fight the criminals."
                  ],
                  answer: 0
                },
                {
                  id: "t1-r-p4-q24",
                  stem: "What is one problem with the film, according to Jessica?",
                  options: [
                    "It seems a bit too long.",
                    "It's sometimes hard to understand what's happening.",
                    "It has too much silly technology in it.",
                    "It has jokes that aren't very funny."
                  ],
                  answer: 1
                },
                {
                  id: "t1-r-p4-q25",
                  stem: "Which of these might appear in a magazine review of the new Bond film?",
                  options: [
                    "It's full of excitement, with Bond jumping across rooftops, so don't be disappointed by the slow start.",
                    "The director wanted to move away from the last Bond film and include a bit less action.",
                    "I'm not sure the title tells you much... but be prepared to watch a rather different kind of Bond movie.",
                    "Daniel Craig performed well as James Bond, but the main female star was disappointing."
                  ],
                  answer: 2
                }
              ]
            },
            {
              id: "part5",
              title: "Part 5",
              description: "Chọn từ đúng (A, B, C hoặc D) để hoàn thành đoạn văn.",
              type: "abcd",
              questions: [
                { id: "t1-r-p5-q26", stem: "Question 26: A. chose  B. decided  C. selected  D. picked", options: ["chose", "decided", "selected", "picked"], answer: 1 },
                { id: "t1-r-p5-q27", stem: "Question 27: A. transport  B. carry  C. tour  D. travel", options: ["transport", "carry", "tour", "travel"], answer: 3 },
                { id: "t1-r-p5-q28", stem: "Question 28: A. said  B. spoke  C. told  D. explained", options: ["said", "spoke", "told", "explained"], answer: 2 },
                { id: "t1-r-p5-q29", stem: "Question 29: A. because  B. so  C. but  D. and", options: ["because", "so", "but", "and"], answer: 0 },
                { id: "t1-r-p5-q30", stem: "Question 30: A. forget  B. lose  C. leave  D. miss", options: ["forget", "lose", "leave", "miss"], answer: 3 },
                { id: "t1-r-p5-q31", stem: "Question 31: A. further  B. after  C. next  D. later", options: ["further", "after", "next", "later"], answer: 1 },
                { id: "t1-r-p5-q32", stem: "Question 32: A. down  B. along  C. from  D. away", options: ["down", "along", "from", "away"], answer: 2 },
                { id: "t1-r-p5-q33", stem: "Question 33: A. shall  B. could  C. must  D. would", options: ["shall", "could", "must", "would"], answer: 1 },
                { id: "t1-r-p5-q34", stem: "Question 34: A. nervous  B. disappointed  C. angry  D. bored", options: ["nervous", "disappointed", "angry", "bored"], answer: 0 },
                { id: "t1-r-p5-q35", stem: "Question 35: A. knew  B. found  C. made  D. met", options: ["knew", "found", "made", "met"], answer: 2 }
              ]
            }
          ]
        },
        {
          id: "listening",
          title: "Listening",
          icon: "🎧",
          parts: [
            {
              id: "part1",
              title: "Part 1",
              description: "Nghe và chọn hình ảnh đúng (A, B hoặc C). Xem hình từ trang sách bên dưới.",
              type: "picture",
              questions: [
                { id: "t1-l-p1-q1", stem: "Which dish did Mark cook in the competition?", image: "assets/listening_images/questions/t1_q1.png", answer: "C" },
                { id: "t1-l-p1-q2", stem: "Where is the girl's book now?", image: "assets/listening_images/questions/t1_q2.png", answer: "B" },
                { id: "t1-l-p1-q3", stem: "Who lives with Josh in his house?", image: "assets/listening_images/questions/t1_q3.png", answer: "A" },
                { id: "t1-l-p1-q4", stem: "What will the girl take with her on holiday?", image: "assets/listening_images/questions/t1_q4.png", answer: "B" },
                { id: "t1-l-p1-q5", stem: "What time will the train to Manchester leave?", image: "assets/listening_images/questions/t1_q5.png", answer: "C" },
                { id: "t1-l-p1-q6", stem: "Where will the friends meet?", image: "assets/listening_images/questions/t1_q6.png", answer: "A" },
                { id: "t1-l-p1-q7", stem: "Which sport will the boy do soon at the centre?", image: "assets/listening_images/questions/t1_q7.png", answer: "C" }
              ]
            },
            {
              id: "part2",
              title: "Part 2",
              description: "Nghe cuộc phỏng vấn với Nick và Mel về ban nhạc Krispy. Chọn A, B hoặc C.",
              type: "abc",
              questions: [
                {
                  id: "t1-l-p2-q8",
                  stem: "When Nick and Mel were younger,",
                  options: [
                    "they studied music at school.",
                    "their father took them to live concerts.",
                    "their mother encouraged them to play music."
                  ],
                  answer: 1
                },
                {
                  id: "t1-l-p2-q9",
                  stem: "When Nick and Mel started writing music together, they",
                  options: [
                    "disagreed about the style they should have.",
                    "didn't want to be the same as other bands.",
                    "were influenced by different kinds of music."
                  ],
                  answer: 2
                },
                {
                  id: "t1-l-p2-q10",
                  stem: "The band Krispy was started after",
                  options: [
                    "Nick began studying at music school.",
                    "two other musicians heard Nick and Mel playing.",
                    "Nick and Mel advertised for the band members."
                  ],
                  answer: 1
                },
                {
                  id: "t1-l-p2-q11",
                  stem: "In the band's first year together,",
                  options: [
                    "concert audiences liked their music.",
                    "they signed a recording contract.",
                    "their national tour was very successful."
                  ],
                  answer: 0
                },
                {
                  id: "t1-l-p2-q12",
                  stem: "What does Nick say about life in the band today?",
                  options: [
                    "The older members look after him and Mel.",
                    "He's pleased to have the chance to travel.",
                    "There's no opportunity for them to relax together."
                  ],
                  answer: 0
                },
                {
                  id: "t1-l-p2-q13",
                  stem: "What disappointment has the band had?",
                  options: [
                    "They haven't yet had a number one single.",
                    "Their first album sold under a million copies.",
                    "A health problem delayed their album recording."
                  ],
                  answer: 0
                }
              ]
            },
            {
              id: "part4",
              title: "Part 4",
              description: "Nghe Ruby và Thomas thảo luận về poster. Chọn A (YES) nếu đồng ý hoặc B (NO) nếu không.",
              type: "yesno",
              options: [
                { id: "A", label: "A. YES" },
                { id: "B", label: "B. NO" }
              ],
              questions: [
                { id: "t1-l-p4-q20", stem: "Ruby realises that the first design of the poster may need improving.", answer: "A" },
                { id: "t1-l-p4-q21", stem: "Thomas thinks the poster should be bigger than last year's.", answer: "B" },
                { id: "t1-l-p4-q22", stem: "Ruby and Thomas agree that the poster should be in colour.", answer: "B" },
                { id: "t1-l-p4-q23", stem: "Ruby thinks the photograph should be in the middle of the poster.", answer: "A" },
                { id: "t1-l-p4-q24", stem: "Thomas suggests they use the same photograph as last year.", answer: "B" },
                { id: "t1-l-p4-q25", stem: "Ruby thinks every word on the poster should be the same size.", answer: "B" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "test2",
      title: "Test 2",
      sections: [
        {
          id: "reading",
          title: "Reading",
          icon: "📖",
          parts: [
            {
              id: "part1",
              title: "Part 1",
              description: "Các thông báo/tin nhắn ngắn — Chọn câu giải thích đúng nhất ý nghĩa của thông báo.",
              type: "abc",
              questions: [
                {
                  id: "t2-r-p1-q1",
                  stem: "Mr Wright's English lesson today will be in Room 24D beside the language laboratory. He's off sick, so use the lesson to revise for the test. Bring your workbooks!",
                  options: [
                    "The English class must take their workbooks to the language laboratory.",
                    "The room for English lessons is changing because of the test.",
                    "The usual English teacher cannot attend today's lesson."
                  ],
                  answer: 2
                },
                {
                  id: "t2-r-p1-q2",
                  stem: "Trip to New York. Application forms will be available from the school office from 1st November.",
                  options: [
                    "Application forms are unavailable after 1st November.",
                    "The earliest that students can pick up their application forms is 1st November.",
                    "Students should give in their application forms on 1st November."
                  ],
                  answer: 1
                },
                {
                  id: "t2-r-p1-q3",
                  stem: "Having a great holiday! Stopped for a barbecue on the way. Went windsurfing today after playing beach volleyball. See you soon! Louis.",
                  options: [
                    "Louis went windsurfing after he went to the funfair yesterday.",
                    "Louis played beach volleyball before he went windsurfing.",
                    "Louis went to the funfair before he had lunch."
                  ],
                  answer: 1
                },
                {
                  id: "t2-r-p1-q4",
                  stem: "Jungle Café SORRY! Tables at the front of the café are reserved for a birthday party.",
                  options: [
                    "Don't sit at the front of the café unless you're attending the party.",
                    "Only people invited to the party can come into the café.",
                    "If you're coming to the party you shouldn't use the tables at the front."
                  ],
                  answer: 0
                },
                {
                  id: "t2-r-p1-q5",
                  stem: "From: Marie To: Sylviane. Thanks for lending me that biology book - I'm glad you got it back OK. You can borrow my chemistry one and return it next week if you want.",
                  options: [
                    "Marie is offering to lend Sylviane a book.",
                    "Marie wants to return one of Sylviane's books to her.",
                    "Marie is asking Sylviane to give back a book she has borrowed."
                  ],
                  answer: 0
                }
              ]
            },
            {
              id: "part2",
              title: "Part 2",
              description: "Ghép mô tả người với câu lạc bộ bơi lội phù hợp (A–H). Mỗi chữ cái chỉ được dùng một lần.",
              type: "matching",
              options: [
                { id: "A", label: "A. Elvers" },
                { id: "B", label: "B. Mermaid Club" },
                { id: "C", label: "C. Penguins" },
                { id: "D", label: "D. Splash!" },
                { id: "E", label: "E. Waterworld" },
                { id: "F", label: "F. Seals Group" },
                { id: "G", label: "G. Waves" },
                { id: "H", label: "H. Sharks" }
              ],
              questions: [
                {
                  id: "t2-r-p2-q6",
                  stem: "Ralph is a strong swimmer, and would like a club that organises challenging long-distance events. He'd also like to improve his technique, but only has weekends free.",
                  answer: "D"
                },
                {
                  id: "t2-r-p2-q7",
                  stem: "Marta has just learnt to swim and wants to improve quickly so she can jump off the top board into a big pool. She prefers indoor pools, but doesn't like doing competitions.",
                  answer: "H"
                },
                {
                  id: "t2-r-p2-q8",
                  stem: "Fiona wants a club where she can swim for pleasure and meet other people. She'd also like a club that organises games in the pool, and regular social events.",
                  answer: "C"
                },
                {
                  id: "t2-r-p2-q9",
                  stem: "Jay can't swim very far at the moment, so he wants to get stronger. He can only attend one evening per week, so would like individual instruction.",
                  answer: "G"
                },
                {
                  id: "t2-r-p2-q10",
                  stem: "Daisy wants to attend a swimming club after 6 p.m. on Tuesday and Thursday. She wants to take swimming tests as she moves up from intermediate to advanced level, and hopes to become a winner in club races.",
                  answer: "E"
                }
              ]
            },
            {
              id: "part3",
              title: "Part 3",
              description: "Đọc bài về Tom Bennett và tác phẩm điêu khắc hươu cao cổ. Chọn A (Correct) hoặc B (Incorrect).",
              type: "truefalse",
              options: [
                { id: "A", label: "A. Correct" },
                { id: "B", label: "B. Incorrect" }
              ],
              questions: [
                { id: "t2-r-p3-q11", stem: "The headmaster wrote to the artist to ask about buying the sculpture for the school.", answer: "B" },
                { id: "t2-r-p3-q12", stem: "The school got the giraffe sculpture free of charge.", answer: "A" },
                { id: "t2-r-p3-q13", stem: "The schoolchildren were looking forward to the arrival of the giraffe.", answer: "B" },
                { id: "t2-r-p3-q14", stem: "The artist Tom Bennett started making metal objects while he was working at a university.", answer: "B" },
                { id: "t2-r-p3-q15", stem: "Tom thinks that he did an excellent drawing on his first day at school.", answer: "B" },
                { id: "t2-r-p3-q16", stem: "Tom only made one metal bicycle for himself and his wife.", answer: "A" },
                { id: "t2-r-p3-q17", stem: "Tom changed one of his metal sculptures into a different animal while he was making it.", answer: "A" },
                { id: "t2-r-p3-q18", stem: "Tom says that his lion sculpture was very popular with small children.", answer: "A" },
                { id: "t2-r-p3-q19", stem: "Tom intends his animal sculptures to appear realistic.", answer: "A" },
                { id: "t2-r-p3-q20", stem: "The pupils of Grangetown High have decided on a name for their giraffe sculpture.", answer: "B" }
              ]
            },
            {
              id: "part4",
              title: "Part 4",
              description: "Đọc bài của Chris Jones về kỳ nghỉ đạp xe. Chọn đáp án đúng A, B, C hoặc D.",
              type: "abcd",
              questions: [
                {
                  id: "t2-r-p4-q21",
                  stem: "What is Chris Jones doing in this text?",
                  options: [
                    "describing the different places he saw while cycling",
                    "comparing cycling to other forms of exercise",
                    "suggesting places to stay on a cycling holiday",
                    "recommending cycling as a good type of holiday"
                  ],
                  answer: 3
                },
                {
                  id: "t2-r-p4-q22",
                  stem: "What do we find out about Chris's bike?",
                  options: [
                    "It wasn't as good as his brother's.",
                    "It was too old to go fast.",
                    "It needed attention at one point.",
                    "It had trouble going up hills."
                  ],
                  answer: 2
                },
                {
                  id: "t2-r-p4-q23",
                  stem: "Chris was pleased because",
                  options: [
                    "he and his brother had chosen a good route.",
                    "he felt much healthier than before he began his trip.",
                    "he met other people who were keen on cycling.",
                    "he went away at the best time of year for cycling."
                  ],
                  answer: 0
                },
                {
                  id: "t2-r-p4-q24",
                  stem: "What did Chris dislike about his trip?",
                  options: [
                    "breaking down",
                    "the food",
                    "the weather",
                    "getting lost"
                  ],
                  answer: 1
                },
                {
                  id: "t2-r-p4-q25",
                  stem: "What might Chris say in a postcard to a friend?",
                  options: [
                    "I'm having a great holiday, spending lots of time in friendly cafes and enjoying being by myself for once!",
                    "I'm having really fit cycling so fast up and down the hills in this part of the countryside.",
                    "I'm pleased to be away from cars and lorries for a change. Having a good time, despite some problems.",
                    "I'm enjoying cycling with my brother this weekend, and staying at a very quiet hotel in this countryside."
                  ],
                  answer: 2
                }
              ]
            },
            {
              id: "part5",
              title: "Part 5",
              description: "Chọn từ đúng (A, B, C hoặc D) để hoàn thành đoạn văn.",
              type: "abcd",
              questions: [
                { id: "t2-r-p5-q26", stem: "Question 26: A. of  B. from  C. with  D. by", options: ["of", "from", "with", "by"], answer: 3 },
                { id: "t2-r-p5-q27", stem: "Question 27: A. what  B. who  C. which  D. whose", options: ["what", "who", "which", "whose"], answer: 2 },
                { id: "t2-r-p5-q28", stem: "Question 28: A. know  B. take  C. inform  D. answer", options: ["know", "take", "inform", "answer"], answer: 0 },
                { id: "t2-r-p5-q29", stem: "Question 29: A. went  B. visited  C. met  D. passed", options: ["went", "visited", "met", "passed"], answer: 1 },
                { id: "t2-r-p5-q30", stem: "Question 30: A. considered  B. guessed  C. wondered  D. doubted", options: ["considered", "guessed", "wondered", "doubted"], answer: 2 },
                { id: "t2-r-p5-q31", stem: "Question 31: A. start  B. cause  C. let  D. bring", options: ["start", "cause", "let", "bring"], answer: 2 },
                { id: "t2-r-p5-q32", stem: "Question 32: A. much  B. many  C. most  D. more", options: ["much", "many", "most", "more"], answer: 3 },
                { id: "t2-r-p5-q33", stem: "Question 33: A. although  B. without  C. instead  D. unless", options: ["although", "without", "instead", "unless"], answer: 1 },
                { id: "t2-r-p5-q34", stem: "Question 34: A. coming  B. going  C. falling  D. moving", options: ["coming", "going", "falling", "moving"], answer: 1 },
                { id: "t2-r-p5-q35", stem: "Question 35: A. become  B. turned  C. gone  D. changed", options: ["become", "turned", "gone", "changed"], answer: 0 }
              ]
            }
          ]
        },
        {
          id: "listening",
          title: "Listening",
          icon: "🎧",
          parts: [
            {
              id: "part1",
              title: "Part 1",
              description: "Nghe và chọn hình ảnh đúng (A, B hoặc C). Xem hình từ trang sách bên dưới.",
              type: "picture",
              questions: [
                { id: "t2-l-p1-q1", stem: "What can't the woman find?", image: "assets/listening_images/questions/t2_q1.png", answer: "B" },
                { id: "t2-l-p1-q2", stem: "What is the weather forecast for tomorrow?", image: "assets/listening_images/questions/t2_q2.png", answer: "C" },
                { id: "t2-l-p1-q3", stem: "What did the boy buy?", image: "assets/listening_images/questions/t2_q3.png", answer: "A" },
                { id: "t2-l-p1-q4", stem: "Which present has the girl bought her mother?", image: "assets/listening_images/questions/t2_q4.png", answer: "C" },
                { id: "t2-l-p1-q5", stem: "Which TV programme will they watch together?", image: "assets/listening_images/questions/t2_q5.png", answer: "B" },
                { id: "t2-l-p1-q6", stem: "What time is the swimming lesson today?", image: "assets/listening_images/questions/t2_q6.png", answer: "B" },
                { id: "t2-l-p1-q7", stem: "Which subject does the boy like best?", image: "assets/listening_images/questions/t2_q7.png", answer: "C" }
              ]
            },
            {
              id: "part2",
              title: "Part 2",
              description: "Nghe Simon kể về trải nghiệm leo tường. Chọn A, B hoặc C.",
              type: "abc",
              questions: [
                {
                  id: "t2-l-p2-q8",
                  stem: "Simon's mum decided to take him to the climbing centre because",
                  options: [
                    "she had enjoyed going there.",
                    "her friend had recommended it.",
                    "Simon had been there with his school."
                  ],
                  answer: 0
                },
                {
                  id: "t2-l-p2-q9",
                  stem: "Before he went to the centre, Simon was",
                  options: [
                    "worried about going climbing there.",
                    "interested in seeing the climbing wall.",
                    "disappointed to hear it was all indoors."
                  ],
                  answer: 2
                },
                {
                  id: "t2-l-p2-q10",
                  stem: "Simon says that at the centre there were",
                  options: [
                    "lots of people when it opened.",
                    "many different types of people.",
                    "no other people his age."
                  ],
                  answer: 1
                },
                {
                  id: "t2-l-p2-q11",
                  stem: "What did Simon think about the climbing wall?",
                  options: [
                    "He thought it looked very high.",
                    "He was afraid he might fall.",
                    "He found the foot holes helpful."
                  ],
                  answer: 2
                },
                {
                  id: "t2-l-p2-q12",
                  stem: "Why was Simon unhappy with his first climb?",
                  options: [
                    "He was slower than everyone else.",
                    "He found it hurt his arms.",
                    "He didn't get to the top."
                  ],
                  answer: 0
                },
                {
                  id: "t2-l-p2-q13",
                  stem: "What does Simon feel he learnt from climbing at the centre?",
                  options: [
                    "how to improve his fitness",
                    "to think before he does something",
                    "the best way to work with other people"
                  ],
                  answer: 2
                }
              ]
            },
            {
              id: "part4",
              title: "Part 4",
              description: "Nghe Jamie và Miranda nói về việc chia sẻ phòng ngủ. Chọn A (YES) hoặc B (NO).",
              type: "yesno",
              options: [
                { id: "A", label: "A. YES" },
                { id: "B", label: "B. NO" }
              ],
              questions: [
                { id: "t2-l-p4-q20", stem: "Jamie complains that his brother refuses to share his electronic equipment.", answer: "A" },
                { id: "t2-l-p4-q21", stem: "Miranda accepts what her sister's side of the room looks like.", answer: "B" },
                { id: "t2-l-p4-q22", stem: "Miranda is annoyed about some things that her sister tells their mother.", answer: "A" },
                { id: "t2-l-p4-q23", stem: "Miranda was surprised that felt lonely when her sister was away.", answer: "A" },
                { id: "t2-l-p4-q24", stem: "Despite sharing a bedroom, Jamie finds he can still easily do his homework.", answer: "B" },
                { id: "t2-l-p4-q25", stem: "Jamie and Miranda can both share problems with their brother or sister.", answer: "A" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "test3",
      title: "Test 3",
      sections: [
        {
          id: "reading",
          title: "Reading",
          icon: "📖",
          parts: [
            {
              id: "part1",
              title: "Part 1",
              description: "Các thông báo/tin nhắn ngắn — Chọn câu giải thích đúng nhất ý nghĩa của thông báo.",
              type: "abc",
              questions: [
                {
                  id: "t3-r-p1-q1",
                  stem: "From: Juan To: Maria. Do you still want to buy my guitar? Pedro wants it too, but you asked me first. Let me know tomorrow at school.",
                  options: [
                    "Juan will sell Maria his guitar if she wants it.",
                    "Pedro has a guitar which Maria might want to buy.",
                    "Juan would prefer to sell his guitar to Pedro."
                  ],
                  answer: 0
                },
                {
                  id: "t3-r-p1-q2",
                  stem: "Maths Homework. Some of you have told me the homework is a bit difficult. So if you haven't finished it by Friday, you can hand it in on Monday. Mr Peters.",
                  options: [
                    "The homework given out on Friday must be returned by Monday.",
                    "Students who wish to hand in their homework on Monday should tell Mr Peters.",
                    "Anyone having problems with their homework may have extra time to complete it."
                  ],
                  answer: 2
                },
                {
                  id: "t3-r-p1-q3",
                  stem: "Dan, Don't forget to put your football shirt in the washing machine as soon as you get home from the match. Add soap powder and turn dial to number 3. Mum.",
                  options: [
                    "Remember to make sure his football shirt is clean in time for the match.",
                    "Remember where he put the football shirt that he needs for the match.",
                    "Remember to wash his football shirt after the match."
                  ],
                  answer: 2
                },
                {
                  id: "t3-r-p1-q4",
                  stem: "From: Sarah To: Janine. Janine my birthday meal's booked for 6.30 Saturday at Luigi's restaurant. I know there are things you can't eat, so I've attached a menu. Tell me if it's OK.",
                  options: [
                    "if Janine will be available to go to the restaurant",
                    "if the food at the restaurant will be all right for Janine",
                    "if Janine wants to see the restaurant menu before Saturday"
                  ],
                  answer: 1
                },
                {
                  id: "t3-r-p1-q5",
                  stem: "PARKSIDE POOL BEYOND THIS RED LINE THE WATER IS VERY SHALLOW - NO DIVING IN THIS AREA",
                  options: [
                    "Part of the pool is not deep enough for diving.",
                    "Diving is forbidden in all areas of the pool.",
                    "The far end of the pool is reserved for divers only."
                  ],
                  answer: 0
                }
              ]
            },
            {
              id: "part2",
              title: "Part 2",
              description: "Ghép mô tả người với cửa hàng quần áo phù hợp (A–H). Mỗi chữ cái chỉ được dùng một lần.",
              type: "matching",
              options: [
                { id: "A", label: "A. Streetwear" },
                { id: "B", label: "B. Balloon" },
                { id: "C", label: "C. Zizi's" },
                { id: "D", label: "D. Teenscape" },
                { id: "E", label: "E. Cinders" },
                { id: "F", label: "F. Orange" },
                { id: "G", label: "G. Fanfare" },
                { id: "H", label: "H. Wardrobe" }
              ],
              questions: [
                {
                  id: "t3-r-p2-q6",
                  stem: "George has to buy some new jeans but hasn't much money to spend. He's quite tall, so he likes to try on clothes to check that they fit.",
                  answer: "F"
                },
                {
                  id: "t3-r-p2-q7",
                  stem: "Rosa would like a beautiful dress for her school's end-of-year party, with earrings to match. Her mother has given her quite a lot of money to spend, and she'd like to buy everything in one store.",
                  answer: "D"
                },
                {
                  id: "t3-r-p2-q8",
                  stem: "Stefan wants to get a smart designer rugby shirt, and doesn't mind how expensive it is. He prefers to choose his clothes online before he goes to town to buy anything.",
                  answer: "A"
                },
                {
                  id: "t3-r-p2-q9",
                  stem: "Tanya wants to buy some skirts and tops that are a bit unusual, so that she'll look different from everyone else at school. She wants to try things on in the shop to make sure they suit her.",
                  answer: "H"
                },
                {
                  id: "t3-r-p2-q10",
                  stem: "Suzie needs to get some fairly cheap sports clothes for wearing at the gym. She's in a hurry, so doesn't want to spend too long shopping.",
                  answer: "B"
                }
              ]
            },
            {
              id: "part3",
              title: "Part 3",
              description: "Đọc thông tin về Citisport. Chọn A (Correct) hoặc B (Incorrect).",
              type: "truefalse",
              options: [
                { id: "A", label: "A. Correct" },
                { id: "B", label: "B. Incorrect" }
              ],
              questions: [
                { id: "t3-r-p3-q11", stem: "Citisport can send their own instructors to schools in the area.", answer: "A" },
                { id: "t3-r-p3-q12", stem: "If the sport you want is unavailable, Citisport will set up a course for you.", answer: "B" },
                { id: "t3-r-p3-q13", stem: "The golf lessons can take place even in bad weather.", answer: "A" },
                { id: "t3-r-p3-q14", stem: "It is necessary to join the Kingsway Golf Centre in order to practise there.", answer: "B" },
                { id: "t3-r-p3-q15", stem: "Teenagers can attend golf lessons on Wednesday afternoons.", answer: "A" },
                { id: "t3-r-p3-q16", stem: "Citisport will provide you with a tennis racket if necessary.", answer: "A" },
                { id: "t3-r-p3-q17", stem: "The football course is for girls of all levels of ability.", answer: "A" },
                { id: "t3-r-p3-q18", stem: "A Newport City player will organise the day's football training.", answer: "B" },
                { id: "t3-r-p3-q19", stem: "A midday meal is included in the price of the girls' football course.", answer: "B" },
                { id: "t3-r-p3-q20", stem: "Each coach will teach up to six people on the gymnastics course.", answer: "A" }
              ]
            },
            {
              id: "part4",
              title: "Part 4",
              description: "Đọc bài của Sam về chuyến tham quan trang trại. Chọn đáp án đúng A, B, C hoặc D.",
              type: "abcd",
              questions: [
                {
                  id: "t3-r-p4-q21",
                  stem: "What is Sam trying to do in the text?",
                  options: [
                    "explain how to bake cakes",
                    "discuss the importance of knowing how to cook",
                    "describe how he enjoyed a day with his family",
                    "inform readers about life on a farm"
                  ],
                  answer: 2
                },
                {
                  id: "t3-r-p4-q22",
                  stem: "Sam's parents took the children to Oakton Farm because they wanted them to",
                  options: [
                    "learn a new skill.",
                    "make something for their grandmother.",
                    "spend time in the countryside.",
                    "meet other people the same age."
                  ],
                  answer: 0
                },
                {
                  id: "t3-r-p4-q23",
                  stem: "What do we learn about Oakton Farm?",
                  options: [
                    "It had lots of animals living there.",
                    "It was far from where they lived.",
                    "It was just like Sam expected.",
                    "It was run by a friendly man."
                  ],
                  answer: 1
                },
                {
                  id: "t3-r-p4-q24",
                  stem: "What does Sam say about his cooking experience?",
                  options: [
                    "He was better at it than his sister.",
                    "He liked wearing the clothes he was given.",
                    "He could be untidy without getting into trouble.",
                    "He was the first to finish."
                  ],
                  answer: 2
                },
                {
                  id: "t3-r-p4-q25",
                  stem: "What might Sam write in a postcard to his grandmother?",
                  options: [
                    "I made some great bread rolls, but my sister ate them because we didn't know who they belonged to.",
                    "We had to clean up the kitchen, like at your house. But we've made great pizza, just like you taught us.",
                    "I loved it, but my sister didn't really. She found it hard to do what the teacher told her.",
                    "We liked swimming in the lake - it helped to pass the time while we waited for our lovely pizzas to be ready."
                  ],
                  answer: 3
                }
              ]
            },
            {
              id: "part5",
              title: "Part 5",
              description: "Chọn từ đúng (A, B, C hoặc D) để hoàn thành đoạn văn.",
              type: "abcd",
              questions: [
                { id: "t3-r-p5-q26", stem: "Question 26: A. found  B. took  C. went  D. gave", options: ["found", "took", "went", "gave"], answer: 1 },
                { id: "t3-r-p5-q27", stem: "Question 27: A. doing  B. making  C. setting  D. using", options: ["doing", "making", "setting", "using"], answer: 3 },
                { id: "t3-r-p5-q28", stem: "Question 28: A. where  B. who  C. which  D. what", options: ["where", "who", "which", "what"], answer: 2 },
                { id: "t3-r-p5-q29", stem: "Question 29: A. yourself  B. himself  C. themselves  D. itself", options: ["yourself", "himself", "themselves", "itself"], answer: 1 },
                { id: "t3-r-p5-q30", stem: "Question 30: A. quickly  B. immediately  C. fast  D. early", options: ["quickly", "immediately", "fast", "early"], answer: 0 },
                { id: "t3-r-p5-q31", stem: "Question 31: A. place  B. site  C. location  D. district", options: ["place", "site", "location", "district"], answer: 3 },
                { id: "t3-r-p5-q32", stem: "Question 32: A. To  B. At  C. For  D. By", options: ["To", "At", "For", "By"], answer: 3 },
                { id: "t3-r-p5-q33", stem: "Question 33: A. industry  B. company  C. trade  D. firm", options: ["industry", "company", "trade", "firm"], answer: 0 },
                { id: "t3-r-p5-q34", stem: "Question 34: A. developed  B. happened  C. appeared  D. displayed", options: ["developed", "happened", "appeared", "displayed"], answer: 2 },
                { id: "t3-r-p5-q35", stem: "Question 35: A. prove  B. explain  C. direct  D. advise", options: ["prove", "explain", "direct", "advise"], answer: 1 }
              ]
            }
          ]
        },
        {
          id: "listening",
          title: "Listening",
          icon: "🎧",
          parts: [
            {
              id: "part1",
              title: "Part 1",
              description: "Nghe và chọn hình ảnh đúng (A, B hoặc C). Xem hình từ trang sách bên dưới.",
              type: "picture",
              questions: [
                { id: "t3-l-p1-q1", stem: "Which T-shirt does the boy decide to buy?", image: "assets/listening_images/questions/t3_q1.png", answer: "A" },
                { id: "t3-l-p1-q2", stem: "Who will be on the stage next?", image: "assets/listening_images/questions/t3_q2.png", answer: "C" },
                { id: "t3-l-p1-q3", stem: "What time will the pie be ready?", image: "assets/listening_images/questions/t3_q3.png", answer: "C" },
                { id: "t3-l-p1-q4", stem: "Which photo does the girl dislike?", image: "assets/listening_images/questions/t3_q4.png", answer: "B" },
                { id: "t3-l-p1-q5", stem: "What should the students take on the school trip?", image: "assets/listening_images/questions/t3_q5.png", answer: "C" },
                { id: "t3-l-p1-q6", stem: "Where do the boys decide to go?", image: "assets/listening_images/questions/t3_q6.png", answer: "A" },
                { id: "t3-l-p1-q7", stem: "What has the girl lost?", image: "assets/listening_images/questions/t3_q7.png", answer: "B" }
              ]
            },
            {
              id: "part2",
              title: "Part 2",
              description: "Nghe Abby kể về môn lướt sóng. Chọn A, B hoặc C.",
              type: "abc",
              questions: [
                {
                  id: "t3-l-p2-q8",
                  stem: "Abby first decided to go surfing when",
                  options: [
                    "her dad offered to teach her.",
                    "she saw some local competitions.",
                    "her mother gave her money for a surfboard."
                  ],
                  answer: 1
                },
                {
                  id: "t3-l-p2-q9",
                  stem: "What did Abby discover when she started surfing?",
                  options: [
                    "Her local surfing school was expensive.",
                    "She needed more equipment than she'd expected.",
                    "It was good to try different surfboards."
                  ],
                  answer: 2
                },
                {
                  id: "t3-l-p2-q10",
                  stem: "What does Abby say about surfing in the winter?",
                  options: [
                    "The sea is warm enough where she lives.",
                    "She wears a special suit for winter surfing.",
                    "The beaches are very quiet then."
                  ],
                  answer: 0
                },
                {
                  id: "t3-l-p2-q11",
                  stem: "How did Abby feel about surfing the enormous wave?",
                  options: [
                    "disappointed she didn't have the right board",
                    "worried at first by the size of the wave",
                    "scared about falling off her board"
                  ],
                  answer: 1
                },
                {
                  id: "t3-l-p2-q12",
                  stem: "What advice does Abby give to teenagers interested in surfing?",
                  options: [
                    "don't start until you're a very strong swimmer",
                    "find a good surfing teacher",
                    "learn to surf in different conditions"
                  ],
                  answer: 2
                },
                {
                  id: "t3-l-p2-q13",
                  stem: "What does Abby want to do next?",
                  options: [
                    "find out about surfing as a career",
                    "study surfing science at university",
                    "train for the next surfing competition"
                  ],
                  answer: 0
                }
              ]
            },
            {
              id: "part4",
              title: "Part 4",
              description: "Nghe Sam và Lisa thảo luận về một cuốn sách. Chọn A (YES) hoặc B (NO).",
              type: "yesno",
              options: [
                { id: "A", label: "A. YES" },
                { id: "B", label: "B. NO" }
              ],
              questions: [
                { id: "t3-l-p4-q20", stem: "Lisa disliked the book when she first started reading it.", answer: "B" },
                { id: "t3-l-p4-q21", stem: "Sam and Lisa felt sorry for Paul, the main character in the book.", answer: "B" },
                { id: "t3-l-p4-q22", stem: "Sam was interested in the mystery about Paul and his brother.", answer: "B" },
                { id: "t3-l-p4-q23", stem: "Lisa thought the author helped the reader to understand Paul.", answer: "A" },
                { id: "t3-l-p4-q24", stem: "Sam wished there was more information about football in the book.", answer: "B" },
                { id: "t3-l-p4-q25", stem: "Lisa liked the way the author developed Paul's character.", answer: "A" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "test4",
      title: "Test 4",
      sections: [
        {
          id: "reading",
          title: "Reading",
          icon: "📖",
          parts: [
            {
              id: "part1",
              title: "Part 1",
              description: "Các thông báo/tin nhắn ngắn — Chọn câu giải thích đúng nhất ý nghĩa của thông báo.",
              type: "abc",
              questions: [
                {
                  id: "t4-r-p1-q1",
                  stem: "From: Miss Phelps To: Class 9. Sorry - there are no theatre tickets left. Anyone who's ordered a ticket but not given me the money yet has until tomorrow to do so.",
                  options: [
                    "You can order your tickets for the trip tomorrow.",
                    "Reserved tickets must be paid for by tomorrow.",
                    "You should return unwanted tickets to Miss Phelps tomorrow."
                  ],
                  answer: 1
                },
                {
                  id: "t4-r-p1-q2",
                  stem: "Nick, Your swimming teacher called about this week's lesson. It'll be on Tuesday, not Thursday as it usually is. It's still at 6 o'clock, but we'll have to leave earlier - by 5.30. Dad.",
                  options: [
                    "Nick's lesson will be on Tuesdays from now on.",
                    "The time of Nick's lesson has changed.",
                    "Nick's lesson this week is at the same time on a different day."
                  ],
                  answer: 2
                },
                {
                  id: "t4-r-p1-q3",
                  stem: "HIGHCLIFFE SCHOOL GALLERY TAKING PHOTOS OF THE ART DISPLAYED HERE IS NOT PERMITTED",
                  options: [
                    "You are not allowed to remove any of the pictures here.",
                    "You are not allowed to display any of your photos here.",
                    "You are not allowed to use your camera here."
                  ],
                  answer: 2
                },
                {
                  id: "t4-r-p1-q4",
                  stem: "After inserting CD, wait for computer to load it before clicking on 'start'.",
                  options: [
                    "Insert CD, click on 'start' and then wait.",
                    "Click on 'start', insert CD and then wait.",
                    "Insert CD, wait and then click on 'start'."
                  ],
                  answer: 2
                },
                {
                  id: "t4-r-p1-q5",
                  stem: "Hi Lara, That video game I borrowed from you was great! I've lent it to Mick. He'll give it back to you on Monday. Hope that's OK. Eve xx.",
                  options: [
                    "Mick will return Lara's computer game to her on Monday.",
                    "Lara will give Eve's computer game to Mick on Monday.",
                    "Mick and Eve will borrow Lara's computer game on Monday."
                  ],
                  answer: 0
                }
              ]
            },
            {
              id: "part2",
              title: "Part 2",
              description: "Ghép mô tả người với sự kiện đặc biệt phù hợp (A–H). Mỗi chữ cái chỉ được dùng một lần.",
              type: "matching",
              options: [
                { id: "A", label: "A. Waspbrook Park" },
                { id: "B", label: "B. Silverbank Island" },
                { id: "C", label: "C. Hopelands Hall" },
                { id: "D", label: "D. Bramley River Centre" },
                { id: "E", label: "E. Downland Park" },
                { id: "F", label: "F. The Collins Centre" },
                { id: "G", label: "G. Oakwood Manor" },
                { id: "H", label: "H. Westsea Castle" }
              ],
              questions: [
                {
                  id: "t4-r-p2-q6",
                  stem: "Angela wants to go out with her younger sister in the evening. They both love learning about wildlife and would like to take part in an organised activity.",
                  answer: "E"
                },
                {
                  id: "t4-r-p2-q7",
                  stem: "Vic would like to go with his friends to listen to several different kinds of music. They also want to be able to buy something to eat.",
                  answer: "B"
                },
                {
                  id: "t4-r-p2-q8",
                  stem: "Beth and her twin sister are interested in art and would like to make something which they can take home as a souvenir of their day. They also want a nice place to eat their packed lunch.",
                  answer: "F"
                },
                {
                  id: "t4-r-p2-q9",
                  stem: "Mike wants to spend the day with a couple of friends. They all enjoy water sports and the open air and are also keen on history.",
                  answer: "H"
                },
                {
                  id: "t4-r-p2-q10",
                  stem: "Molly and her friend are enjoying a school project on the environment and are keen to discover more about this topic. They want to go somewhere where they can spend the day and also get some lunch.",
                  answer: "A"
                }
              ]
            },
            {
              id: "part3",
              title: "Part 3",
              description: "Đọc bài của Rebecca Hardy về Ocean Centre. Chọn A (Correct) hoặc B (Incorrect).",
              type: "truefalse",
              options: [
                { id: "A", label: "A. Correct" },
                { id: "B", label: "B. Incorrect" }
              ],
              questions: [
                { id: "t4-r-p3-q11", stem: "Rebecca Hardy's home is close to the coast.", answer: "B" },
                { id: "t4-r-p3-q12", stem: "At the Ocean Centre, you can see fish from both seas and rivers.", answer: "A" },
                { id: "t4-r-p3-q13", stem: "All the creatures that are on display at the Centre are harmless.", answer: "B" },
                { id: "t4-r-p3-q14", stem: "The admission fee for the Centre goes towards environmental projects.", answer: "A" },
                { id: "t4-r-p3-q15", stem: "Rebecca was allowed to feed the fish at the Centre.", answer: "B" },
                { id: "t4-r-p3-q16", stem: "Rebecca had to book in advance to see the fish at their feeding time.", answer: "B" },
                { id: "t4-r-p3-q17", stem: "The Ocean Centre has the largest collection of seahorses in the world.", answer: "B" },
                { id: "t4-r-p3-q18", stem: "Rebecca was pleased that she was able to see baby seahorses in the exhibition.", answer: "A" },
                { id: "t4-r-p3-q19", stem: "Each day, the Centre holds lots of talks on different topics.", answer: "B" },
                { id: "t4-r-p3-q20", stem: "Rebecca found she could leave and return to the Centre during her visit without paying again.", answer: "A" }
              ]
            },
            {
              id: "part4",
              title: "Part 4",
              description: "Đọc bài của Rachel Martin về trượt ván. Chọn đáp án đúng A, B, C hoặc D.",
              type: "abcd",
              questions: [
                {
                  id: "t4-r-p4-q21",
                  stem: "In this text Rachel Martin",
                  options: [
                    "explains what equipment is needed for skateboarding.",
                    "describes the places for skateboarding in her area.",
                    "persuades young people to enter skateboarding competitions.",
                    "compares skateboarding with other sports."
                  ],
                  answer: 1
                },
                {
                  id: "t4-r-p4-q22",
                  stem: "Why was it hard for Rachel to go skateboarding last year?",
                  options: [
                    "There wasn't a skatepark near enough to her house.",
                    "None of her friends were able to go with her.",
                    "She was worried she would hurt herself.",
                    "She wasn't allowed to go out in the evenings."
                  ],
                  answer: 0
                },
                {
                  id: "t4-r-p4-q23",
                  stem: "What does Rachel say about the skatepark at her school?",
                  options: [
                    "It allows younger children to practise their skating.",
                    "It takes too many people away from other sports.",
                    "It is used for several different activities.",
                    "It is more crowded than the skatepark in town."
                  ],
                  answer: 2
                },
                {
                  id: "t4-r-p4-q24",
                  stem: "What does Rachel like about skateboarding?",
                  options: [
                    "getting the chance to be good at something",
                    "having to think carefully",
                    "learning new skills from her sister",
                    "doing an activity with girls of her own age"
                  ],
                  answer: 1
                },
                {
                  id: "t4-r-p4-q25",
                  stem: "Which of the following might Rachel write in her diary?",
                  options: [
                    "Did another competition today - I won, although I was the youngest. But then I have got two years' experience.",
                    "Didn't feel like practising tonight, so stayed in and watched TV instead. That's the fourth time this week!",
                    "Was skating on the pavement today when I fell and hurt my ankle. I've done that three times now.",
                    "Couldn't use school skatepark today - there were too many bikers. My little brother wanted to play there but it wasn't safe for him."
                  ],
                  answer: 3
                }
              ]
            },
            {
              id: "part5",
              title: "Part 5",
              description: "Chọn từ đúng (A, B, C hoặc D) để hoàn thành đoạn văn.",
              type: "abcd",
              questions: [
                { id: "t4-r-p5-q26", stem: "Question 26: A. for  B. of  C. from  D. with", options: ["for", "of", "from", "with"], answer: 1 },
                { id: "t4-r-p5-q27", stem: "Question 27: A. take  B. do  C. spend  D. make", options: ["take", "do", "spend", "make"], answer: 2 },
                { id: "t4-r-p5-q28", stem: "Question 28: A. called  B. noted  C. known  D. said", options: ["called", "noted", "known", "said"], answer: 2 },
                { id: "t4-r-p5-q29", stem: "Question 29: A. consists  B. involves  C. contains  D. employs", options: ["consists", "involves", "contains", "employs"], answer: 0 },
                { id: "t4-r-p5-q30", stem: "Question 30: A. size  B. number  C. level  D. lot", options: ["size", "number", "level", "lot"], answer: 1 },
                { id: "t4-r-p5-q31", stem: "Question 31: A. part  B. away  C. place  D. up", options: ["part", "away", "place", "up"], answer: 0 },
                { id: "t4-r-p5-q32", stem: "Question 32: A. prepare  B. attend  C. improve  D. produce", options: ["prepare", "attend", "improve", "produce"], answer: 2 },
                { id: "t4-r-p5-q33", stem: "Question 33: A. how  B. where  C. why  D. then", options: ["how", "where", "why", "then"], answer: 0 },
                { id: "t4-r-p5-q34", stem: "Question 34: A. moved  B. held  C. kept  D. led", options: ["moved", "held", "kept", "led"], answer: 3 },
                { id: "t4-r-p5-q35", stem: "Question 35: A. although  B. when  C. unless  D. while", options: ["although", "when", "unless", "while"], answer: 1 }
              ]
            }
          ]
        },
        {
          id: "listening",
          title: "Listening",
          icon: "🎧",
          parts: [
            {
              id: "part1",
              title: "Part 1",
              description: "Nghe và chọn hình ảnh đúng (A, B hoặc C). Xem hình từ trang sách bên dưới.",
              type: "picture",
              questions: [
                { id: "t4-l-p1-q1", stem: "When will Jack's mum pick him up?", image: "assets/listening_images/questions/t4_q1.png", answer: "B" },
                { id: "t4-l-p1-q2", stem: "Which postcard will they send?", image: "assets/listening_images/questions/t4_q2.png", answer: "A" },
                { id: "t4-l-p1-q3", stem: "What do they decide to buy?", image: "assets/listening_images/questions/t4_q3.png", answer: "A" },
                { id: "t4-l-p1-q4", stem: "What has the girl forgotten to bring?", image: "assets/listening_images/questions/t4_q4.png", answer: "B" },
                { id: "t4-l-p1-q5", stem: "How does the man want his son to help him?", image: "assets/listening_images/questions/t4_q5.png", answer: "C" },
                { id: "t4-l-p1-q6", stem: "Which TV programme is on at nine o'clock tonight?", image: "assets/listening_images/questions/t4_q6.png", answer: "C" },
                { id: "t4-l-p1-q7", stem: "What will the boy do first?", image: "assets/listening_images/questions/t4_q7.png", answer: "A" }
              ]
            },
            {
              id: "part2",
              title: "Part 2",
              description: "Nghe Maria kể về sự nghiệp thể dục dụng cụ. Chọn A, B hoặc C.",
              type: "abc",
              questions: [
                {
                  id: "t4-l-p2-q8",
                  stem: "Maria decided to take up gymnastics",
                  options: [
                    "at a gymnastics competition.",
                    "in a sports lesson at the school.",
                    "when she read a book about a gymnast."
                  ],
                  answer: 0
                },
                {
                  id: "t4-l-p2-q9",
                  stem: "When did Maria realise she could be champion gymnast?",
                  options: [
                    "when she won some local competitions",
                    "as soon as she started to practise gymnastics",
                    "when a well-known coach offered to teach her"
                  ],
                  answer: 2
                },
                {
                  id: "t4-l-p2-q10",
                  stem: "Why does Maria think success has not changed her?",
                  options: [
                    "She believes she's a sensible person.",
                    "Her parents help her live a normal life.",
                    "People tell her she's the same as before."
                  ],
                  answer: 0
                },
                {
                  id: "t4-l-p2-q11",
                  stem: "What does Maria say about school?",
                  options: [
                    "She feels too tired to study.",
                    "She has little time with school friends.",
                    "She is allowed to miss some lessons."
                  ],
                  answer: 1
                },
                {
                  id: "t4-l-p2-q12",
                  stem: "What does Maria do in her free time?",
                  options: [
                    "make videos",
                    "go to concerts",
                    "watch cartoon films"
                  ],
                  answer: 0
                },
                {
                  id: "t4-l-p2-q13",
                  stem: "What is Maria's favourite thing in her room at home?",
                  options: [
                    "a poster of a band with a singer",
                    "a glass case with her cups and prizes",
                    "a picture of herself with another gymnast"
                  ],
                  answer: 2
                }
              ]
            },
            {
              id: "part4",
              title: "Part 4",
              description: "Nghe Claire và Lucas thảo luận về buổi hòa nhạc Candy Floss. Chọn A (YES) hoặc B (NO).",
              type: "yesno",
              options: [
                { id: "A", label: "A. YES" },
                { id: "B", label: "B. NO" }
              ],
              questions: [
                { id: "t4-l-p4-q20", stem: "Claire could see the band clearly from where she sat.", answer: "A" },
                { id: "t4-l-p4-q21", stem: "Lucas thinks Candy Floss gave a great performance during the concert.", answer: "A" },
                { id: "t4-l-p4-q22", stem: "Claire feels the band's dancing was better in the summer.", answer: "B" },
                { id: "t4-l-p4-q23", stem: "Lucas and Claire have the same opinion about the band's costumes.", answer: "B" },
                { id: "t4-l-p4-q24", stem: "Claire is planning to buy the next album by Candy Floss.", answer: "A" },
                { id: "t4-l-p4-q25", stem: "Lucas thinks tickets for the next concert will be difficult to get.", answer: "B" }
              ]
            }
          ]
        }
      ]
    }
  ]
};
