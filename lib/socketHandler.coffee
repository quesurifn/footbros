docs = [
  {
    permalink: 'introduction'
    player:
      name: "Introduction"
    steps: [
      {index: 1, type: 'photo', url: 'https://www.tapcentive.com/img/fragments.jpg', caption: 'Hey there this is step one of setup'}
      {index: 2, type: 'video', url: 'http://www.youtube.com/embed/gW2UWuPTekk', caption: 'Watch this video'}
      {index: 3, type: 'photo', url: 'https://www.tapcentive.com/img/fragments.jpg', caption: 'This is my first time setting up tapcentive'}
      {index: 4, type: 'dialog', messages: [
          "Hey there, I'm Francke Jones, did it work?",
          "This is how its done.... got it?",
          "Great, now go have fun"
        ]}
    ]
  },
  {
    permalink: 'architecture'
    player:
      name: "Tapcentive Design & Architecture"
    steps: [
    ]
  },
  {
    permalink: 'requirements'
    player:
      name: "Requirements"
    steps: [
    ]
  },
  {
    permalink: 'installation'
    player:
      name: "Installing the Tapcentive SDK"
    steps: [
    ]
  },
  {
    permalink: 'building-the-reference-app'
    player:
      name: "Building the Reference App"
    steps: [
    ]
  },
  {
    permalink: 'checking-the-build'
    player:
      name: "Checking the Build"
    steps: [
    ]
  }

]

module.exports = (socket) ->
  socket.emit('docs', docs)
