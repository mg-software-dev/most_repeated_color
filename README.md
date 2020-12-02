# most_repeated_color

### this is a mini project that let's you upload an image,
### and returns the most used colors

### the complexity of this task is in the image size :
### i get a decent performance, i mean, i did tests with a 3840 x 2160 image
### (thats more than 8,500,000 pixels) and did a lot of operations
### and it took 10 secons aprox to finish the task
### The idea is simple :
### - get the pixel array
### - count how many times each color is in the image
### - map that to a { color: amount } object
### - sort and filter that data
### - map again to color based on filtered data and an { amount: color } object
### - pop values based on the amount of colors specified by the user
### - show colors on divs

