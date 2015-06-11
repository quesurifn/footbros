if device.desktop()
  window.Franchino = angular.module('Franchino', ['ngSanitize', 'ui.router', 'btford.socket-io', 'tap.controllers', 'tap.directives'])

else
  window.Franchino = angular.module("Franchino", [ 'ionic',
    'btford.socket-io',
    'tap.controllers',
    'tap.directives',
    'tap.product',
    'auth0',
    'angular-storage',
    'angular-jwt'])

Franchino.run ($ionicPlatform, $rootScope) ->
  $rootScope.server = 'https://gamify-node.herokuapp.com'
  $ionicPlatform.ready ->
      if window.StatusBar
        StatusBar.styleDefault()
      # Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      # for form inputs)
      if window.cordova and window.cordova.plugins.Keyboard
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar true
      if window.StatusBar
        # org.apache.cordova.statusbar required
        StatusBar.styleDefault()
      return
    return


Franchino.config ($sceDelegateProvider) ->
  $sceDelegateProvider.resourceUrlWhitelist [
      'self'
      new RegExp('^(http[s]?)://(w{3}.)?youtube.com/.+$')
    ]
  return


Franchino.config ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, authProvider, jwtInterceptorProvider) ->

  $stateProvider

    .state 'app',
      url: ''
      abstract: true
      controller: 'AppCtrl'
      templateUrl: 'menu.html'

    .state('login',
      url: '/login'
      templateUrl: 'login.html'
      controller: 'LoginCtrl')

    .state('app.products',
      url: '/products'
      views:
        menuContent:
          templateUrl: 'product-list.html'
          controller: 'ProductListCtrl')

    .state 'app.product-detail',
      url: '/product/:name/:brewery/:alcohol/:tags/:video'
      views:
        menuContent:
          templateUrl: 'product-detail.html'
          controller: 'ProductDetailCtrl'

    .state 'app.intro',
      url: '/intro',
      views:
        menuContent:
          controller: 'IntroCtrl'
          templateUrl: 'intro.html'

    .state 'app.home',
      url: '/home'
      views:
        menuContent:
          controller: 'HomeCtrl'
          templateUrl: 'home.html'

    .state 'app.docs',
      url: '/docs'
      views:
        menuContent:
          controller: 'DocsCtrl'
          templateUrl: 'docs/index.html'

    .state 'app.about',
      url: '/about'
      views:
        menuContent:
          controller: 'AboutCtrl'
          templateUrl: 'about.html'


    .state 'app.blog',
      url: '/blog'
      views:
        menuContent:
          controller: 'BlogCtrl'
          templateUrl: 'blog.html'

    .state 'app.resume',
      url: '/resume'
      views:
        menuContent:
          controller: 'ResumeCtrl'
          templateUrl: 'resume.html'

    .state 'app.contact',
      url: '/contact'
      views:
        menuContent:
          controller: 'ContactCtrl'
          templateUrl: 'contact.html'

    .state 'app.doc',
      url: '/docs/:permalink'
      views:
        menuContent:
          controller: 'DocCtrl'
          templateUrl: 'docs/show.html'

    .state 'app.step',
      url: '/docs/:permalink/:step'
      views:
        menuContent:
          controller: 'DocCtrl'
          templateUrl: 'docs/show.html'

    .state 'app.job-tapcentive',
      url: '/job-tapcentive'
      views:
        menuContent:
          controller: 'JobTapcentiveCtrl'
          templateUrl: 'job-tapcentive.html'

    .state 'app.job-tapcentive-two',
      url: '/job-tapcentive-two'
      views:
        menuContent:
          controller: 'JobTapcentiveTwoCtrl'
          templateUrl: 'job-tapcentive-two.html'

    .state 'app.job-cpgio',
      url: '/job-cpgio'
      views:
        menuContent:
          controller: 'JobCpgioCtrl'
          templateUrl: 'job-cpgio.html'

    .state 'app.job-medycation',
      url: '/job-medycation'
      views:
        menuContent:
          controller: 'JobMedycationCtrl'
          templateUrl: 'job-medycation.html'

    .state 'app.job-cst',
      url: '/job-cst'
      views:
        menuContent:
          controller: 'JobCstCtrl'
          templateUrl: 'job-cst.html'

    .state 'app.job-koupn',
      url: '/job-koupn'
      views:
        menuContent:
          controller: 'JobKoupnCtrl'
          templateUrl: 'job-koupn.html'

    .state 'app.job-tround',
      url: '/job-tround'
      views:
        menuContent:
          controller: 'JobTroundCtrl'
          templateUrl: 'job-tround.html'

    .state 'app.job-monthlys',
      url: '/job-monthlys'
      views:
        menuContent:
          controller: 'JobMonthlysCtrl'
          templateUrl: 'job-monthlys.html'

    .state 'app.job-monthlys-two',
      url: '/job-monthlys-two'
      views:
        menuContent:
          controller: 'JobMonthlysTwoCtrl'
          templateUrl: 'job-monthlys-two.html'

    .state 'app.job-benchprep',
      url: '/job-benchprep'
      views:
        menuContent:
          controller: 'JobBenchprepCtrl'
          templateUrl: 'job-benchprep.html'

        # Configure Auth0
      authProvider.init
        domain: AUTH0_DOMAIN
        clientID: AUTH0_CLIENT_ID
        sso: true
        loginState: 'products'

    $urlRouterProvider.otherwise "/products"

    jwtInterceptorProvider.tokenGetter = (store, jwtHelper, auth) ->
      idToken = store.get('token')
      refreshToken = store.get('refreshToken')
      if !idToken or !refreshToken
        return null
      if jwtHelper.isTokenExpired(idToken)
        auth.refreshIdToken(refreshToken).then (idToken) ->
          store.set 'token', idToken
          idToken
      else
        idToken

      $httpProvider.interceptors.push 'jwtInterceptor'
      return

    $httpProvider.interceptors.push ->
       request: (config) ->
         if config.url.match(/\.html$/) && !config.url.match(/^shared\//)
           if device.tablet()
             type = 'tablet'
           else if device.mobile()
             type = 'mobile'
           else
             type = 'desktop'

           config.url = "/#{type}/#{config.url}"

         config

  authProvider.on "loginSuccess", ($location, profilePromise, idToken, store, refreshToken) ->
    profilePromise.then (profile) ->
      lock = new Auth0Lock('A126XWdJZY715w3B6yVCevpS8tYmPJrj', 'footbros.auth0.com');

      store.set 'profile', profile
      store.set 'token', idToken
      store.set 'refreshToken', refreshToken
      localStorage.setItem('token', idToken);
      window.location.href = 'http://alcura-shop.herokuapp.com'

  authProvider.on "authenticated", ($location, error) ->
    $location.url 'http://alcura-shop.herokuapp.com'


  authProvider.on "loginFailure", ($location, error) ->


Franchino.run ($rootScope, auth, store) ->
  $rootScope.$on '$locationChangeStart', ->
    if !auth.isAuthenticated
      token = store.get('token')
      if token
        auth.authenticate store.get('profile'), token
    return
  return


Franchino.run ($state) ->
  $state.go('app.home')

Franchino.run ($rootScope, copy) ->
  $rootScope.copy = copy

Franchino.factory 'Socket', (socketFactory) ->
  socketFactory()

Franchino.factory 'Docs', (Socket) ->
  service =
    list: []
    find: (permalink) ->
      _.find service.list, (doc) ->
        doc.permalink == permalink

  Socket.on 'docs', (docs) ->
    service.list = docs

  service

Franchino.controller 'HomeCtrl', ($scope) ->

Franchino.controller 'ContactSheetCtrl', ($scope, $ionicActionSheet) ->
  $scope.showActionsheet = ->
    $ionicActionSheet.show
      titleText: "Contact Franchino"
      buttons: [
        {
          text: "Github <i class=\"icon ion-share\"></i>"
        }
        {
          text: "Email Me <i class=\"icon ion-email\"></i>"
        }
        {
          text: "Twitter <i class=\"icon ion-social-twitter\"></i>"
        }
        {
          text: "224-241-9189 <i class=\"icon ion-ios-telephone\"></i>"
        }
      ]
      cancelText: "Cancel"
      cancel: ->
        console.log "CANCELLED"
        return

      buttonClicked: (index) ->
        window.location.href = "224-241-9189"  if index is 2
        window.location.href = "http://twitter.com/franchino_che"  if index is 2
        window.location.href = "mailto:franchino.nonce@gmail.com"  if index is 1
        window.location.href = "http://github.com/frangucc"  if index is 0
        true

  return
Franchino.controller "SlidesTapOneCtrl", ($scope) ->
  $scope.date = 'NOVEMBER 2014'
  $scope.title = 'Tapcentive manager UX overhaul and front-end'
  $scope.images = [
    {
      "alt" : "Tapcentive.com UX overhaul and SPA front-end",
      "url" : "/img/gif/report.gif",
      "text" : "<p>Study the user and their goals and overhaul the experience while re-writing the front-end in Angular.</p><a href='http://tapcentive.com' target='_blank'>Visit Website</a>"
    }
  ]

Franchino.controller "SlidesTapTwoCtrl", ($scope) ->
  $scope.date = 'OCTOBER 2014'
  $scope.title = 'Desktop and mobile web friendly marketing website'
  $scope.images = [
    {
      "alt" : "Some alt text",
      "url" : "/img/franchino-tapcentive-yellow.jpg",
      "text" : "<p>Create a knockout brand strategy with an awesome look and feel. Make a sophisticated offering look simple and easy to use.</p><a href='http://tapcentive.com' target='_blank'>Visit Website</a>"
    }

  ]

Franchino.controller "SlidesCpgCtrl", ($scope) ->
  $scope.date = 'JULY 2014'
  $scope.title = 'Identity, full-stack MVP, and marketing website for a new CPG eDistribution company'
  $scope.images = [
    {
      "alt" : "Some alt text",
      "url" : "/img/francino_cpgio.jpg",
      "text" : "<p>Turn an old school CPG business into a sophisticated technology company. Design secure, automated and transformative platform, technical architecture and execute an MVP enough to aquire first customers. Mission accomplished.</p><a href='http://cpg.io' target='_blank'>Visit Website</a>"
    }
  ]

Franchino.controller "SlidesMedycationCtrl", ($scope) ->
  $scope.date = 'APRIL 2014'
  $scope.title = 'User experience design and rapid prototyping for Medycation, a new healthcare price comparison website'
  $scope.images = [
    {
      "alt" : "Some alt text",
      "url" : "/img/franchino-medycation.jpg",
      "text" : "<p>Waltz up in the online healthcare industry guns blazing with killer design and instincts. Get this new company off the ground with it's MVP. Swipe for more views.</p><a href='http://medycation.com' target='_blank'>Visit Website</a>"
    },
    {
      "alt" : "Some alt text",
      "url" : "/img/franchino-medycation2.jpg",
      "text" : ""
    },
    {
      "alt" : "Some alt text",
      "url" : "/img/franchino-medycation3.jpg"
    },
    {
      "alt" : "Some alt text",
      "url" : "/img/franchino-medycation4.jpg"
    },
  ]

Franchino.controller "SlidesCSTCtrl", ($scope) ->
  $scope.date = 'APRIL 2014'
  $scope.title = 'Designed and developed a new version of the Chicago Sun Times using a hybrid Ionic/Angular stack'
  $scope.images = [
    {
      "alt" : "Some alt text",
      "url" : "/img/franchino-cst.jpg",
      "text" : "<p>Help the struggling media giant upgrade their consumer facing technology. Create one code base in Angular capable of generating kick-ass experiences for mobile, tablet, web and TV."
    },
    {
      "alt" : "Some alt text",
      "url" : "/img/franchino-cst2.jpg"
    },
    {
      "alt" : "Some alt text",
      "url" : "/img/franchino-cst3.jpg"
    },
  ]

Franchino.controller "SlidesKoupnCtrl", ($scope) ->
  $scope.date = 'MARCH 2014'
  $scope.title = 'Brand refresh, marketing site and platform experience overhaul'
  $scope.images = [
    {
      "alt" : "Some alt text",
      "url" : "/img/franchino-koupn1.jpg"
    },
    {
      "alt" : "Some alt text",
      "url" : "/img/franchino-koupn2.jpg"
    },
    {
      "alt" : "Some alt text",
      "url" : "/img/franchino-koupn.jpg"
    },
  ]

Franchino.controller "SlidesTroundCtrl", ($scope) ->
  $scope.date = 'AUGUST 2013'
  $scope.title = 'Social travel mobile app design, UX and rapid prototyping'
  $scope.images = [
    {
      "alt" : "Some alt text",
      "url" : "/img/francino_tround.jpg",
      "text" : "Design an Instagram based social travel app. Why? I don't know."
    }
  ]

Franchino.controller "SlidesMonthlysCtrl", ($scope) ->
  $scope.date = 'FEBRUARY 2013'
  $scope.title = 'Customer portal platform UX design and front-end'
  $scope.images = [
    {
      "alt" : "Some alt text",
      "url" : "/img/franchino-monthlys-biz2.jpg"
    },
    {
      "alt" : "Some alt text",
      "url" : "/img/franchino_monthlys.jpg"
    }
  ]

Franchino.controller "SlidesMonthlysTwoCtrl", ($scope) ->
  $scope.date = 'MARCH 2012'
  $scope.title = 'Entrepreneur in residence at Lightbank'
  $scope.images = [
    {
      "alt" : "Some alt text",
      "url" : "/img/franchino-monthlys7.jpg"
    },
    {
      "alt" : "Some alt text",
      "url" : "/img/franchino-monthlys5.jpg"
    },
    {
      "alt" : "Some alt text",
      "url" : "/img/franchino-monthlys2.jpg"
    }
  ]

Franchino.controller "BlogCtrl", ($scope) ->

  $scope.articles = [
    {
      "date" : "Posted by Franchino on December 12, 2014",
      "heading" : "My path to learning Swift",
      "authorimg" : "/img/frank.png",
      "img" : "/img/dec/newsletter-swiftris-header.gif",
      "blob" : "I've been an MVC developer in every language except for iOS. This past October, I took my first real deep dive into iOS programming and started with Swift. There are two great tutorials out there. The first is from bloc.io and is free. It's a game, Swiftris, so get ready for some action. The second will help you build something more appish, it's by Appcoda. Got their book and will be done with it this week. So far, books ok, but it moves really slow.",
      "resource1" : "https://www.bloc.io/swiftris-build-your-first-ios-game-with-swift",
      "resource2" : "http://www.appcoda.com/swift/"
    },
    {
      "date" : "Posted by Franchino on December 11, 2014",
      "heading" : "Why I get goose bumps when you talk about automated email marketing and segmentation and customer.io and things like that.",
      "authorimg" : "/img/frank.png",
      "img" : "/img/dec/prepemails.png",
      "blob" : "I get teary eyed when I talk about my work at BenchPrep.com. In short, I was the first employee and helped the company get to their series B near the end of year two. I got a lot done there, and one of the things I really enjoyed was building out technology to segment leads, bring different users down different communication paths and how I mapped out the entire system using complex diagrams and workflows. Some of the tools were built and based on ques like Redis or Resque, others we built into ExactTarget and Customer.io. In the end, I became somewhat of an expert at monetizing emails. Within our email marketing channel, we explored tagging users based on their actions, such as opens or non opens, or what they clicked on, we targed email users who had been touched seven times with special irrisitable sales, because we know after 6 touches, we could convert. These tricks we learned led to 25-30k days, and eventually, days where we sold 100k worth of subscriptions. So, my point? Don't be surprised if I geek out and faint when I hear you talk about transactional emailing and cadences and consumer journies and stuff like that."
    },
    {
      "date" : "Posted by Franchino on December 10, 2014",
      "heading" : "If I could have one wish; I get to use this method when designing your consumer journey funnel.",
      "authorimg" : "/img/frank.png",
      "img" : "/img/dec/ux_board.jpg",
      "blob" : "So after a bunch of ethnographic studies from persona matches I gather in-person, I get to fill a wall up with key things people said, felt, heard - motivators, barriers, questions, attitudes and such. I then group these post-it thoughts in various ways, looking for patterns, sentiment, new ideas. I then take this rich data and develop a what could be branding, a landing page or an email - with what I call, an inverted pyramid approach to content, where addressing the most important things found in the user research get addressed in a heriarchical order. I create 5-6 iterations of the landing page and re-run them through a second group of participants, stakeholders and friends. I then take even more notes on peoples speak-aloud reactions to the landing pages. After this, I'm ready to design the final copy and pages for your funnel."
    },
    {
      "date" : "Posted by Franchino on December 9, 2014",
      "heading" : "Did I even belong here?",
      "authorimg" : "/img/frank.png",
      "img" : "/img/dec/ucla.jpg",
      "blob" : "This coming weekend there's probably a hackathon going on in your city. Some of them are getting really big. I wasn't registered for LA Hacks this summer. I don't even know how I ended up there on a Friday night, but when I saw what was going on, I grabbed a chair and started hacking away. Worried I had just snuck in the back door and started competing, my ride left and there I was, for the next two days. That's right. I snuck in the back of LA Hacks last summer at UCLA and hacked with kids 10 years younger than me. I couldn't miss it. I was floored when I saw how many people were in it. Me, being the mischevious hacker I am, I thought if I used the energy of the environment to my advantage, I could build something cool. Long story short, let me just say, that if you have been having a hard time launching, sign up for a hackathon. It's a guaranteed way to over-compensate for your constant failure to launch. More on what happened when I took the stage by surprise and got booted later..."
    }
  ]



Franchino.controller 'AboutCtrl', ($scope) ->

Franchino.controller 'AppCtrl', ($scope) ->

Franchino.controller 'ResumeCtrl', ($scope) ->
  $scope.blob = '<div class="row"><div class="large-12"><div class="row"><div class="large-12 columns"><h6>NOV 2013 - PRESENT</h6><br/><h2>Hybrid Experience Designer/Developer, Independent</h2><br/><p>Worked with noteable entreprenours on several new product and business launches. Held numerous roles, including content strategist, user researcher, designer and developer. </p><p><strong>Companies</strong></p><ul class="no"><li><a href="http://tapcentive.com" target="_blank">Tapcentive</a></li><li><a href="http://cpg.io" target="_blank">CPGio</a></li><li><a href="http://kou.pn/">Kou.pn Media</a></li><li> <a href="http://medycation.com" target="_blank">Medycation</a></li><li> <a href="http://www.suntimes.com/" target="_blank">Chicago Sun Times</a></li></ul><br/><p><strong>Tapcentive Deliverables</strong></p><ul class="bullets"><li>Complete Tapcentive.com marketing website and UX overhaul of core product, the "Tapcentive Manager"</li><li>Industrial design of the Tapcentive Touchpoint</li><li>Content strategy for corporate marketing site</li><li>Mobile first marketing website using Ionic and Angular</li></ul><p><strong>CPGio Deliverables</strong></p><ul class="bullets"><li>Product and business strategy, technical architecture and specification design</li><li>One hundred page proposal template on business model and corporate capabilities</li><li>Marketing website design and content strategy</li><li>Core product design and MVP functional prototype</li></ul><p><strong>Kou.pn Deliverables</strong></p><ul class="bullets"><li>Kou.pn Media brand refresh</li><li>Marketing site redesign</li><li>Portal user experience overhaul</li></ul><p><strong>Medycation Deliverables</strong></p><ul class="bullets"><li>Conceptual design and art direction</li><li>User research</li><li>Rapid prototypes</li></ul><p><strong>Chicago Sun Times</strong></p><ul class="bullets"><li>Conceptual design and art direction</li><li>Native iOS and Android app design and junior development</li><li>Hybrid Ionic/Angular development</li></ul></div></div><br/><div class="row"><div class="large-12 columns"><h6>MARCH 2010 - OCTOBER 2013</h6><br/><h2>Director of User Experience, Lightbank</h2><br/><p>Launched and supported multiple new companies within the Lightbank portfolio. </p><p><strong>Companies</strong></p><ul class="no"><li> <a href="http://chicagoideas.com" target="_blank">ChicagoIdeas.com</a></li><li> <a href="http://benchprep.com" target="_blank">BenchPrep.com</a></li><li> <a href="http://snapsheetapp.com" target="_blank">SnapSheetApp.com</a></li><li>Monthlys.com (defunct)</li><li> <a href="http://dough.com" target="_blank">Dough.com</a></li><li> <a href="http://groupon.com" target="_blank">Groupon.com</a></li></ul><br/><p><strong>Chicago Ideas Deliverables</strong></p><ul class="bullets"><li>Website design refresh, art direction</li><li>Custom ticket purchasing platform UX research &amp; design</li><li>Ruby on Rails development, maintenence</li><li>Graphic design support</li><li>Annual report design</li></ul><p><strong>BenchPrep.com Deliverables</strong></p><ul class="bullets"><li>Re-branding, complete BenchPrep identity package</li><li>Supported company with all design and ux from zero to eight million in financing</li><li>Lead art and UX direction for two years</li><li>Front-end using Backbone and Bootstrap</li><li>User research, ethnographic studies, user testing</li><li>Email marketing cadence system design and execution</li><li>Scripted, storyboarded and executed both animated and live motion explainer videos</li></ul><p><strong>SnapSheetApp.com Deliverables</strong></p><ul class="bullets"><li>Large scale portal UX research and information architecture</li><li>Three rounds of rapid prototyping and user testing</li><li>Graphic design and interaction design framework</li><li>User testing</li></ul><p><strong>Monthlys.com Deliverables</strong></p><ul class="bullets"><li>Identity and art direction</li><li>Product strategy and new company launch</li><li>Online marketing strategy, including transactional email, promotion design and lead generation</li><li>Product experience design and front-end</li><li>Content strategy</li><li>Scripted, storyboarded and executed both animated and live motion explainer videos</li></ul><p><strong>Dough.com Deliverables</strong></p><ul class="bullets bullets"><li>Consumer journey mapping and ethnographic studies</li><li>Rapid prototyping, conceptual design</li><li>Messaging strategy, user testing</li></ul><p><strong>Groupon.com Deliverables</strong></p><ul class="bullets"><li>Emerging markets research</li><li>Rapid design and prototyping</li><li>Visual design on new concepts</li><li>Email segmentation research</li></ul></div></div><br/><div class="row"><div class="large-12 columns"><h6>NOVEMBER 2007 - APRIL 2010</h6><br/><h2>Developer &amp; Co-founder, Dillyeo.com</h2><br/><p>Co-founded, designed and developed a daily deal eCommerce website.</p><p><strong>Role</strong><br/>Designed, developed and launched companies first cart with PHP. Iterated and grew site to more than two hundred and fifty thousand subscribers in less than one year. </p><p><strong>Noteable Stats</strong></p><ul class="bullets"><li>Built a list of 250,000 subscribers in the first year</li><li>Pivoted and tweaked design, business and approach to 1000 transactions per daily</li><li>Sold business in December 2009 to Innovative Commerce Solutions</li></ul></div></div><br/><div class="row"><div class="large-12 columns"><h6>MARCH 2005 - OCTOBER 2007</h6><br/><h2>Solutions Architect &amp; Senior Developer, <a href="http://www.manifestdigital.com/">Manifest Digital</a></h2><br/><p>Built and managed multiple CareerBuilder.com niche sites for the largest independent agency in the midwest.</p><p><strong>Role</strong><br/>Research and explore emerging technologies, implement solutions and manage other developers. Worked with asp.net on a daily basis for almost two years. </p><p><strong>Noteable Accomplishments</strong></p><ul class="bullets"><li>Recognized for launching high quality web app for Career Builder in record time</li><li>Managed extreme SEO project with more than 500 thousand links, pages and over 8 million UGC artifacts</li><li>Shifted agencies development practices to various new client-centric AJAX methodologies</li><li>Managed multiple projects concurrently, including choosechicago.com and briefing.com</li></ul></div></div><br/><div class="row"><div class="large-12 columns"><h6>APRIL 2004 - JANUARY 2007</h6><br/><h2>Junior PLD Developer,  <a href="http://www.manifestdigital.com/">Avenue</a></h2><br/><p>Front-end developer and UX design intern for Avenue A Razorfishs\' legacy company, Avenue-inc.</p><p><strong>Role</strong><br/>Develop front-end for multiple client websites, including flor.com, achievement.org, canyonranch.com and turbochef.</p><p><strong>Noteable Accomplishments</strong></p><ul class="bullets"><li>Executed front-end projects on-time and under-budget</li><li>Assigned UX internship role, recognized by design team as a young talent</li><li>Wireframed custom shopping cart platform for flor.com</li><li>Developed internal SEO practice</li></ul></div></div><br/><div class="row"><div class="large-12 columns"><h6>JULY 2000 - JANUARY 2004</h6><br/><h2>eCommerce Developer, Atova</h2><br/><p>General web designer and developer for family owned paint distribution business. </p><p><strong>Role</strong><br/>Built several shopping carts in classic ASP and PHP. Grew business using online marketing strategies to two million in revenue. </p><p><strong>Noteable Accomplishments</strong></p><ul class="bullets"><li>Became first company to ship paints and coatings across the United States</li><li>First employee, developed company to 2+ million in revenue with Overture, Google Adwords and SEO</li><li>Created, marketed and subscribed vocational school for specialty coatings</li><li>Worked with top Italian paint manufacturers overseas to build exclusive distribution rights</li></ul></div></div><br/><div class="row"><div class="large-12 columns"><h6>SEPTEMBER 2000 - MAY 2002</h6><br/><h2>Education</h2><br/><p>Self educated designer/programmer with vocational training. </p><p><strong>Certifications</strong><br/>iNET+, A+ Certification </p><p><strong>Apprenticeship</strong><br/>Year long personal apprenticeship with first engineer at Amazon.com</p></div></div></div></div><br/><br/>'

Franchino.controller 'JobTapcentiveCtrl', ($scope) ->

Franchino.controller 'JobTapcentiveTwoCtrl', ($scope) ->

Franchino.controller 'JobCpgioCtrl', ($scope) ->

Franchino.controller 'JobMedycationCtrl', ($scope) ->

Franchino.controller 'JobCstCtrl', ($scope) ->

Franchino.controller 'JobKoupnCtrl', ($scope) ->

Franchino.controller 'JobMedycationCtrl', ($scope) ->

Franchino.controller 'JobMedycationCtrl', ($scope) ->

Franchino.controller 'JobTroundCtrl', ($scope) ->

Franchino.controller 'JobMonthlysOneCtrl', ($scope) ->

Franchino.controller 'JobMonthlysTwoCtrl', ($scope) ->

Franchino.controller 'JobBenchprepCtrl', ($scope) ->

Franchino.controller 'ContactCtrl', ($scope) ->

Franchino.controller 'DevelopersCtrl', ($scope) ->

Franchino.controller 'DeveloperCenterCtrl', ($scope) ->

Franchino.controller 'DocsCtrl', ($scope, Docs) ->
  $scope.$watch (-> Docs.list), ->
    $scope.docs = Docs.list

Franchino.controller 'DocCtrl', ($scope, $sce, $stateParams, $timeout, Docs) ->
  $scope.index = if $stateParams.step then $stateParams.step-1 else 0

  $scope.$watch (-> Docs.list), ->
    $scope.doc = Docs.find($stateParams.permalink)
    if $scope.doc
      $scope.step = $scope.doc.steps[$scope.index]
      $scope.step.url = $sce.trustAsResourceUrl($scope.step.url)

      if $scope.step.type == 'dialog'
        $scope.messageIndex = 0
        $scope.messages = []
        $timeout($scope.nextMessage, 1000)

  $scope.hasMoreSteps = ->
    if $scope.step
      $scope.step.index < $scope.doc.steps.length

Franchino.directive 'mySlideshow', ->
  restrict: 'AC'
  link: (scope, element, attrs) ->
    config = angular.extend(
      slides: '.slide',
    scope.$eval(attrs.mySlideshow))
    setTimeout (->
      $(element).cycle ->
        fx:     'fade',
        speed:  'fast',
        next:   '#next2',
        prev:   '#prev2',
        caption: '#alt-caption',
        caption_template: '{{images.alt}}',
        pause_on_hover: 'true'

    ), 0
