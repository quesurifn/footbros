if (device.desktop()) {
  window.Franchino = angular.module('Franchino', ['ngSanitize', 'ui.router', 'btford.socket-io', 'tap.controllers', 'tap.directives']);
} else {
  window.Franchino = angular.module("Franchino", ['ionic', 'btford.socket-io', 'tap.controllers', 'tap.directives', 'tap.product', 'auth0', 'angular-storage', 'angular-jwt']);
}

Franchino.run(function($ionicPlatform, $rootScope) {
  $rootScope.server = 'http://localhost:5000';
  $ionicPlatform.ready(function() {
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

Franchino.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^(http[s]?)://(w{3}.)?youtube.com/.+$')]);
});

Franchino.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, authProvider, jwtInterceptorProvider) {
  $stateProvider.state('app', {
    url: '',
    abstract: true,
    controller: 'AppCtrl',
    templateUrl: 'menu.html'
  }).state('login', {
    url: '/login',
    templateUrl: 'login.html',
    controller: 'LoginCtrl'
  }).state('app.products', {
    url: '/products',
    views: {
      menuContent: {
        templateUrl: 'product-list.html',
        controller: 'ProductListCtrl'
      }
    }
  }).state('app.product-detail', {
    url: '/product/:name/:brewery/:alcohol/:tags/:video',
    views: {
      menuContent: {
        templateUrl: 'product-detail.html',
        controller: 'ProductDetailCtrl'
      }
    }
  }).state('app.intro', {
    url: '/intro',
    views: {
      menuContent: {
        controller: 'IntroCtrl',
        templateUrl: 'intro.html'
      }
    }
  }).state('app.home', {
    url: '/home',
    views: {
      menuContent: {
        controller: 'HomeCtrl',
        templateUrl: 'home.html'
      }
    }
  }).state('app.docs', {
    url: '/docs',
    views: {
      menuContent: {
        controller: 'DocsCtrl',
        templateUrl: 'docs/index.html'
      }
    }
  }).state('app.about', {
    url: '/about',
    views: {
      menuContent: {
        controller: 'AboutCtrl',
        templateUrl: 'about.html'
      }
    }
  }).state('app.blog', {
    url: '/blog',
    views: {
      menuContent: {
        controller: 'BlogCtrl',
        templateUrl: 'blog.html'
      }
    }
  }).state('app.resume', {
    url: '/resume',
    views: {
      menuContent: {
        controller: 'ResumeCtrl',
        templateUrl: 'resume.html'
      }
    }
  }).state('app.contact', {
    url: '/contact',
    views: {
      menuContent: {
        controller: 'ContactCtrl',
        templateUrl: 'contact.html'
      }
    }
  }).state('app.doc', {
    url: '/docs/:permalink',
    views: {
      menuContent: {
        controller: 'DocCtrl',
        templateUrl: 'docs/show.html'
      }
    }
  }).state('app.step', {
    url: '/docs/:permalink/:step',
    views: {
      menuContent: {
        controller: 'DocCtrl',
        templateUrl: 'docs/show.html'
      }
    }
  }).state('app.job-tapcentive', {
    url: '/job-tapcentive',
    views: {
      menuContent: {
        controller: 'JobTapcentiveCtrl',
        templateUrl: 'job-tapcentive.html'
      }
    }
  }).state('app.job-tapcentive-two', {
    url: '/job-tapcentive-two',
    views: {
      menuContent: {
        controller: 'JobTapcentiveTwoCtrl',
        templateUrl: 'job-tapcentive-two.html'
      }
    }
  }).state('app.job-cpgio', {
    url: '/job-cpgio',
    views: {
      menuContent: {
        controller: 'JobCpgioCtrl',
        templateUrl: 'job-cpgio.html'
      }
    }
  }).state('app.job-medycation', {
    url: '/job-medycation',
    views: {
      menuContent: {
        controller: 'JobMedycationCtrl',
        templateUrl: 'job-medycation.html'
      }
    }
  }).state('app.job-cst', {
    url: '/job-cst',
    views: {
      menuContent: {
        controller: 'JobCstCtrl',
        templateUrl: 'job-cst.html'
      }
    }
  }).state('app.job-koupn', {
    url: '/job-koupn',
    views: {
      menuContent: {
        controller: 'JobKoupnCtrl',
        templateUrl: 'job-koupn.html'
      }
    }
  }).state('app.job-tround', {
    url: '/job-tround',
    views: {
      menuContent: {
        controller: 'JobTroundCtrl',
        templateUrl: 'job-tround.html'
      }
    }
  }).state('app.job-monthlys', {
    url: '/job-monthlys',
    views: {
      menuContent: {
        controller: 'JobMonthlysCtrl',
        templateUrl: 'job-monthlys.html'
      }
    }
  }).state('app.job-monthlys-two', {
    url: '/job-monthlys-two',
    views: {
      menuContent: {
        controller: 'JobMonthlysTwoCtrl',
        templateUrl: 'job-monthlys-two.html'
      }
    }
  }).state('app.job-benchprep', {
    url: '/job-benchprep',
    views: {
      menuContent: {
        controller: 'JobBenchprepCtrl',
        templateUrl: 'job-benchprep.html'
      }
    }
  }, authProvider.init({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    loginState: 'products'
  }));
  $urlRouterProvider.otherwise("/products");
  jwtInterceptorProvider.tokenGetter = function(store, jwtHelper, auth) {
    var idToken, refreshToken;
    idToken = store.get('token');
    refreshToken = store.get('refreshToken');
    if (!idToken || !refreshToken) {
      return null;
    }
    if (jwtHelper.isTokenExpired(idToken)) {
      auth.refreshIdToken(refreshToken).then(function(idToken) {
        store.set('token', idToken);
        return idToken;
      });
    } else {
      idToken;
    }
    $httpProvider.interceptors.push('jwtInterceptor');
  };
  return $httpProvider.interceptors.push(function() {
    return {
      request: function(config) {
        var type;
        if (config.url.match(/\.html$/) && !config.url.match(/^shared\//)) {
          if (device.tablet()) {
            type = 'tablet';
          } else if (device.mobile()) {
            type = 'mobile';
          } else {
            type = 'desktop';
          }
          config.url = "/" + type + "/" + config.url;
        }
        return config;
      }
    };
  });
});

Franchino.run(function($rootScope, auth, store) {
  $rootScope.$on('$locationChangeStart', function() {
    var token;
    if (!auth.isAuthenticated) {
      token = store.get('token');
      if (token) {
        auth.authenticate(store.get('profile'), token);
      }
    }
  });
});

Franchino.run(function($state) {
  return $state.go('app.home');
});

Franchino.run(function($rootScope, copy) {
  return $rootScope.copy = copy;
});

Franchino.factory('Socket', function(socketFactory) {
  return socketFactory();
});

Franchino.factory('Docs', function(Socket) {
  var service;
  service = {
    list: [],
    find: function(permalink) {
      return _.find(service.list, function(doc) {
        return doc.permalink === permalink;
      });
    }
  };
  Socket.on('docs', function(docs) {
    return service.list = docs;
  });
  return service;
});

Franchino.controller('HomeCtrl', function($scope) {});

Franchino.controller('ContactSheetCtrl', function($scope, $ionicActionSheet) {
  $scope.showActionsheet = function() {
    return $ionicActionSheet.show({
      titleText: "Contact Franchino",
      buttons: [
        {
          text: "Github <i class=\"icon ion-share\"></i>"
        }, {
          text: "Email Me <i class=\"icon ion-email\"></i>"
        }, {
          text: "Twitter <i class=\"icon ion-social-twitter\"></i>"
        }, {
          text: "224-241-9189 <i class=\"icon ion-ios-telephone\"></i>"
        }
      ],
      cancelText: "Cancel",
      cancel: function() {
        console.log("CANCELLED");
      },
      buttonClicked: function(index) {
        if (index === 2) {
          window.location.href = "224-241-9189";
        }
        if (index === 2) {
          window.location.href = "http://twitter.com/franchino_che";
        }
        if (index === 1) {
          window.location.href = "mailto:franchino.nonce@gmail.com";
        }
        if (index === 0) {
          window.location.href = "http://github.com/frangucc";
        }
        return true;
      }
    });
  };
});

Franchino.controller("SlidesTapOneCtrl", function($scope) {
  $scope.date = 'NOVEMBER 2014';
  $scope.title = 'Tapcentive manager UX overhaul and front-end';
  return $scope.images = [
    {
      "alt": "Tapcentive.com UX overhaul and SPA front-end",
      "url": "/img/gif/report.gif",
      "text": "<p>Study the user and their goals and overhaul the experience while re-writing the front-end in Angular.</p><a href='http://tapcentive.com' target='_blank'>Visit Website</a>"
    }
  ];
});

Franchino.controller("SlidesTapTwoCtrl", function($scope) {
  $scope.date = 'OCTOBER 2014';
  $scope.title = 'Desktop and mobile web friendly marketing website';
  return $scope.images = [
    {
      "alt": "Some alt text",
      "url": "/img/franchino-tapcentive-yellow.jpg",
      "text": "<p>Create a knockout brand strategy with an awesome look and feel. Make a sophisticated offering look simple and easy to use.</p><a href='http://tapcentive.com' target='_blank'>Visit Website</a>"
    }
  ];
});

Franchino.controller("SlidesCpgCtrl", function($scope) {
  $scope.date = 'JULY 2014';
  $scope.title = 'Identity, full-stack MVP, and marketing website for a new CPG eDistribution company';
  return $scope.images = [
    {
      "alt": "Some alt text",
      "url": "/img/francino_cpgio.jpg",
      "text": "<p>Turn an old school CPG business into a sophisticated technology company. Design secure, automated and transformative platform, technical architecture and execute an MVP enough to aquire first customers. Mission accomplished.</p><a href='http://cpg.io' target='_blank'>Visit Website</a>"
    }
  ];
});

Franchino.controller("SlidesMedycationCtrl", function($scope) {
  $scope.date = 'APRIL 2014';
  $scope.title = 'User experience design and rapid prototyping for Medycation, a new healthcare price comparison website';
  return $scope.images = [
    {
      "alt": "Some alt text",
      "url": "/img/franchino-medycation.jpg",
      "text": "<p>Waltz up in the online healthcare industry guns blazing with killer design and instincts. Get this new company off the ground with it's MVP. Swipe for more views.</p><a href='http://medycation.com' target='_blank'>Visit Website</a>"
    }, {
      "alt": "Some alt text",
      "url": "/img/franchino-medycation2.jpg",
      "text": ""
    }, {
      "alt": "Some alt text",
      "url": "/img/franchino-medycation3.jpg"
    }, {
      "alt": "Some alt text",
      "url": "/img/franchino-medycation4.jpg"
    }
  ];
});

Franchino.controller("SlidesCSTCtrl", function($scope) {
  $scope.date = 'APRIL 2014';
  $scope.title = 'Designed and developed a new version of the Chicago Sun Times using a hybrid Ionic/Angular stack';
  return $scope.images = [
    {
      "alt": "Some alt text",
      "url": "/img/franchino-cst.jpg",
      "text": "<p>Help the struggling media giant upgrade their consumer facing technology. Create one code base in Angular capable of generating kick-ass experiences for mobile, tablet, web and TV."
    }, {
      "alt": "Some alt text",
      "url": "/img/franchino-cst2.jpg"
    }, {
      "alt": "Some alt text",
      "url": "/img/franchino-cst3.jpg"
    }
  ];
});

Franchino.controller("SlidesKoupnCtrl", function($scope) {
  $scope.date = 'MARCH 2014';
  $scope.title = 'Brand refresh, marketing site and platform experience overhaul';
  return $scope.images = [
    {
      "alt": "Some alt text",
      "url": "/img/franchino-koupn1.jpg"
    }, {
      "alt": "Some alt text",
      "url": "/img/franchino-koupn2.jpg"
    }, {
      "alt": "Some alt text",
      "url": "/img/franchino-koupn.jpg"
    }
  ];
});

Franchino.controller("SlidesTroundCtrl", function($scope) {
  $scope.date = 'AUGUST 2013';
  $scope.title = 'Social travel mobile app design, UX and rapid prototyping';
  return $scope.images = [
    {
      "alt": "Some alt text",
      "url": "/img/francino_tround.jpg",
      "text": "Design an Instagram based social travel app. Why? I don't know."
    }
  ];
});

Franchino.controller("SlidesMonthlysCtrl", function($scope) {
  $scope.date = 'FEBRUARY 2013';
  $scope.title = 'Customer portal platform UX design and front-end';
  return $scope.images = [
    {
      "alt": "Some alt text",
      "url": "/img/franchino-monthlys-biz2.jpg"
    }, {
      "alt": "Some alt text",
      "url": "/img/franchino_monthlys.jpg"
    }
  ];
});

Franchino.controller("SlidesMonthlysTwoCtrl", function($scope) {
  $scope.date = 'MARCH 2012';
  $scope.title = 'Entrepreneur in residence at Lightbank';
  return $scope.images = [
    {
      "alt": "Some alt text",
      "url": "/img/franchino-monthlys7.jpg"
    }, {
      "alt": "Some alt text",
      "url": "/img/franchino-monthlys5.jpg"
    }, {
      "alt": "Some alt text",
      "url": "/img/franchino-monthlys2.jpg"
    }
  ];
});

Franchino.controller("BlogCtrl", function($scope) {
  return $scope.articles = [
    {
      "date": "Posted by Franchino on December 12, 2014",
      "heading": "My path to learning Swift",
      "authorimg": "/img/frank.png",
      "img": "/img/dec/newsletter-swiftris-header.gif",
      "blob": "I've been an MVC developer in every language except for iOS. This past October, I took my first real deep dive into iOS programming and started with Swift. There are two great tutorials out there. The first is from bloc.io and is free. It's a game, Swiftris, so get ready for some action. The second will help you build something more appish, it's by Appcoda. Got their book and will be done with it this week. So far, books ok, but it moves really slow.",
      "resource1": "https://www.bloc.io/swiftris-build-your-first-ios-game-with-swift",
      "resource2": "http://www.appcoda.com/swift/"
    }, {
      "date": "Posted by Franchino on December 11, 2014",
      "heading": "Why I get goose bumps when you talk about automated email marketing and segmentation and customer.io and things like that.",
      "authorimg": "/img/frank.png",
      "img": "/img/dec/prepemails.png",
      "blob": "I get teary eyed when I talk about my work at BenchPrep.com. In short, I was the first employee and helped the company get to their series B near the end of year two. I got a lot done there, and one of the things I really enjoyed was building out technology to segment leads, bring different users down different communication paths and how I mapped out the entire system using complex diagrams and workflows. Some of the tools were built and based on ques like Redis or Resque, others we built into ExactTarget and Customer.io. In the end, I became somewhat of an expert at monetizing emails. Within our email marketing channel, we explored tagging users based on their actions, such as opens or non opens, or what they clicked on, we targed email users who had been touched seven times with special irrisitable sales, because we know after 6 touches, we could convert. These tricks we learned led to 25-30k days, and eventually, days where we sold 100k worth of subscriptions. So, my point? Don't be surprised if I geek out and faint when I hear you talk about transactional emailing and cadences and consumer journies and stuff like that."
    }, {
      "date": "Posted by Franchino on December 10, 2014",
      "heading": "If I could have one wish; I get to use this method when designing your consumer journey funnel.",
      "authorimg": "/img/frank.png",
      "img": "/img/dec/ux_board.jpg",
      "blob": "So after a bunch of ethnographic studies from persona matches I gather in-person, I get to fill a wall up with key things people said, felt, heard - motivators, barriers, questions, attitudes and such. I then group these post-it thoughts in various ways, looking for patterns, sentiment, new ideas. I then take this rich data and develop a what could be branding, a landing page or an email - with what I call, an inverted pyramid approach to content, where addressing the most important things found in the user research get addressed in a heriarchical order. I create 5-6 iterations of the landing page and re-run them through a second group of participants, stakeholders and friends. I then take even more notes on peoples speak-aloud reactions to the landing pages. After this, I'm ready to design the final copy and pages for your funnel."
    }, {
      "date": "Posted by Franchino on December 9, 2014",
      "heading": "Did I even belong here?",
      "authorimg": "/img/frank.png",
      "img": "/img/dec/ucla.jpg",
      "blob": "This coming weekend there's probably a hackathon going on in your city. Some of them are getting really big. I wasn't registered for LA Hacks this summer. I don't even know how I ended up there on a Friday night, but when I saw what was going on, I grabbed a chair and started hacking away. Worried I had just snuck in the back door and started competing, my ride left and there I was, for the next two days. That's right. I snuck in the back of LA Hacks last summer at UCLA and hacked with kids 10 years younger than me. I couldn't miss it. I was floored when I saw how many people were in it. Me, being the mischevious hacker I am, I thought if I used the energy of the environment to my advantage, I could build something cool. Long story short, let me just say, that if you have been having a hard time launching, sign up for a hackathon. It's a guaranteed way to over-compensate for your constant failure to launch. More on what happened when I took the stage by surprise and got booted later..."
    }
  ];
});

Franchino.controller('AboutCtrl', function($scope) {});

Franchino.controller('AppCtrl', function($scope) {});

Franchino.controller('ResumeCtrl', function($scope) {
  return $scope.blob = '<div class="row"><div class="large-12"><div class="row"><div class="large-12 columns"><h6>NOV 2013 - PRESENT</h6><br/><h2>Hybrid Experience Designer/Developer, Independent</h2><br/><p>Worked with noteable entreprenours on several new product and business launches. Held numerous roles, including content strategist, user researcher, designer and developer. </p><p><strong>Companies</strong></p><ul class="no"><li><a href="http://tapcentive.com" target="_blank">Tapcentive</a></li><li><a href="http://cpg.io" target="_blank">CPGio</a></li><li><a href="http://kou.pn/">Kou.pn Media</a></li><li> <a href="http://medycation.com" target="_blank">Medycation</a></li><li> <a href="http://www.suntimes.com/" target="_blank">Chicago Sun Times</a></li></ul><br/><p><strong>Tapcentive Deliverables</strong></p><ul class="bullets"><li>Complete Tapcentive.com marketing website and UX overhaul of core product, the "Tapcentive Manager"</li><li>Industrial design of the Tapcentive Touchpoint</li><li>Content strategy for corporate marketing site</li><li>Mobile first marketing website using Ionic and Angular</li></ul><p><strong>CPGio Deliverables</strong></p><ul class="bullets"><li>Product and business strategy, technical architecture and specification design</li><li>One hundred page proposal template on business model and corporate capabilities</li><li>Marketing website design and content strategy</li><li>Core product design and MVP functional prototype</li></ul><p><strong>Kou.pn Deliverables</strong></p><ul class="bullets"><li>Kou.pn Media brand refresh</li><li>Marketing site redesign</li><li>Portal user experience overhaul</li></ul><p><strong>Medycation Deliverables</strong></p><ul class="bullets"><li>Conceptual design and art direction</li><li>User research</li><li>Rapid prototypes</li></ul><p><strong>Chicago Sun Times</strong></p><ul class="bullets"><li>Conceptual design and art direction</li><li>Native iOS and Android app design and junior development</li><li>Hybrid Ionic/Angular development</li></ul></div></div><br/><div class="row"><div class="large-12 columns"><h6>MARCH 2010 - OCTOBER 2013</h6><br/><h2>Director of User Experience, Lightbank</h2><br/><p>Launched and supported multiple new companies within the Lightbank portfolio. </p><p><strong>Companies</strong></p><ul class="no"><li> <a href="http://chicagoideas.com" target="_blank">ChicagoIdeas.com</a></li><li> <a href="http://benchprep.com" target="_blank">BenchPrep.com</a></li><li> <a href="http://snapsheetapp.com" target="_blank">SnapSheetApp.com</a></li><li>Monthlys.com (defunct)</li><li> <a href="http://dough.com" target="_blank">Dough.com</a></li><li> <a href="http://groupon.com" target="_blank">Groupon.com</a></li></ul><br/><p><strong>Chicago Ideas Deliverables</strong></p><ul class="bullets"><li>Website design refresh, art direction</li><li>Custom ticket purchasing platform UX research &amp; design</li><li>Ruby on Rails development, maintenence</li><li>Graphic design support</li><li>Annual report design</li></ul><p><strong>BenchPrep.com Deliverables</strong></p><ul class="bullets"><li>Re-branding, complete BenchPrep identity package</li><li>Supported company with all design and ux from zero to eight million in financing</li><li>Lead art and UX direction for two years</li><li>Front-end using Backbone and Bootstrap</li><li>User research, ethnographic studies, user testing</li><li>Email marketing cadence system design and execution</li><li>Scripted, storyboarded and executed both animated and live motion explainer videos</li></ul><p><strong>SnapSheetApp.com Deliverables</strong></p><ul class="bullets"><li>Large scale portal UX research and information architecture</li><li>Three rounds of rapid prototyping and user testing</li><li>Graphic design and interaction design framework</li><li>User testing</li></ul><p><strong>Monthlys.com Deliverables</strong></p><ul class="bullets"><li>Identity and art direction</li><li>Product strategy and new company launch</li><li>Online marketing strategy, including transactional email, promotion design and lead generation</li><li>Product experience design and front-end</li><li>Content strategy</li><li>Scripted, storyboarded and executed both animated and live motion explainer videos</li></ul><p><strong>Dough.com Deliverables</strong></p><ul class="bullets bullets"><li>Consumer journey mapping and ethnographic studies</li><li>Rapid prototyping, conceptual design</li><li>Messaging strategy, user testing</li></ul><p><strong>Groupon.com Deliverables</strong></p><ul class="bullets"><li>Emerging markets research</li><li>Rapid design and prototyping</li><li>Visual design on new concepts</li><li>Email segmentation research</li></ul></div></div><br/><div class="row"><div class="large-12 columns"><h6>NOVEMBER 2007 - APRIL 2010</h6><br/><h2>Developer &amp; Co-founder, Dillyeo.com</h2><br/><p>Co-founded, designed and developed a daily deal eCommerce website.</p><p><strong>Role</strong><br/>Designed, developed and launched companies first cart with PHP. Iterated and grew site to more than two hundred and fifty thousand subscribers in less than one year. </p><p><strong>Noteable Stats</strong></p><ul class="bullets"><li>Built a list of 250,000 subscribers in the first year</li><li>Pivoted and tweaked design, business and approach to 1000 transactions per daily</li><li>Sold business in December 2009 to Innovative Commerce Solutions</li></ul></div></div><br/><div class="row"><div class="large-12 columns"><h6>MARCH 2005 - OCTOBER 2007</h6><br/><h2>Solutions Architect &amp; Senior Developer, <a href="http://www.manifestdigital.com/">Manifest Digital</a></h2><br/><p>Built and managed multiple CareerBuilder.com niche sites for the largest independent agency in the midwest.</p><p><strong>Role</strong><br/>Research and explore emerging technologies, implement solutions and manage other developers. Worked with asp.net on a daily basis for almost two years. </p><p><strong>Noteable Accomplishments</strong></p><ul class="bullets"><li>Recognized for launching high quality web app for Career Builder in record time</li><li>Managed extreme SEO project with more than 500 thousand links, pages and over 8 million UGC artifacts</li><li>Shifted agencies development practices to various new client-centric AJAX methodologies</li><li>Managed multiple projects concurrently, including choosechicago.com and briefing.com</li></ul></div></div><br/><div class="row"><div class="large-12 columns"><h6>APRIL 2004 - JANUARY 2007</h6><br/><h2>Junior PLD Developer,  <a href="http://www.manifestdigital.com/">Avenue</a></h2><br/><p>Front-end developer and UX design intern for Avenue A Razorfishs\' legacy company, Avenue-inc.</p><p><strong>Role</strong><br/>Develop front-end for multiple client websites, including flor.com, achievement.org, canyonranch.com and turbochef.</p><p><strong>Noteable Accomplishments</strong></p><ul class="bullets"><li>Executed front-end projects on-time and under-budget</li><li>Assigned UX internship role, recognized by design team as a young talent</li><li>Wireframed custom shopping cart platform for flor.com</li><li>Developed internal SEO practice</li></ul></div></div><br/><div class="row"><div class="large-12 columns"><h6>JULY 2000 - JANUARY 2004</h6><br/><h2>eCommerce Developer, Atova</h2><br/><p>General web designer and developer for family owned paint distribution business. </p><p><strong>Role</strong><br/>Built several shopping carts in classic ASP and PHP. Grew business using online marketing strategies to two million in revenue. </p><p><strong>Noteable Accomplishments</strong></p><ul class="bullets"><li>Became first company to ship paints and coatings across the United States</li><li>First employee, developed company to 2+ million in revenue with Overture, Google Adwords and SEO</li><li>Created, marketed and subscribed vocational school for specialty coatings</li><li>Worked with top Italian paint manufacturers overseas to build exclusive distribution rights</li></ul></div></div><br/><div class="row"><div class="large-12 columns"><h6>SEPTEMBER 2000 - MAY 2002</h6><br/><h2>Education</h2><br/><p>Self educated designer/programmer with vocational training. </p><p><strong>Certifications</strong><br/>iNET+, A+ Certification </p><p><strong>Apprenticeship</strong><br/>Year long personal apprenticeship with first engineer at Amazon.com</p></div></div></div></div><br/><br/>';
});

Franchino.controller('JobTapcentiveCtrl', function($scope) {});

Franchino.controller('JobTapcentiveTwoCtrl', function($scope) {});

Franchino.controller('JobCpgioCtrl', function($scope) {});

Franchino.controller('JobMedycationCtrl', function($scope) {});

Franchino.controller('JobCstCtrl', function($scope) {});

Franchino.controller('JobKoupnCtrl', function($scope) {});

Franchino.controller('JobMedycationCtrl', function($scope) {});

Franchino.controller('JobMedycationCtrl', function($scope) {});

Franchino.controller('JobTroundCtrl', function($scope) {});

Franchino.controller('JobMonthlysOneCtrl', function($scope) {});

Franchino.controller('JobMonthlysTwoCtrl', function($scope) {});

Franchino.controller('JobBenchprepCtrl', function($scope) {});

Franchino.controller('ContactCtrl', function($scope) {});

Franchino.controller('DevelopersCtrl', function($scope) {});

Franchino.controller('DeveloperCenterCtrl', function($scope) {});

Franchino.controller('DocsCtrl', function($scope, Docs) {
  return $scope.$watch((function() {
    return Docs.list;
  }), function() {
    return $scope.docs = Docs.list;
  });
});

Franchino.controller('DocCtrl', function($scope, $sce, $stateParams, $timeout, Docs) {
  $scope.index = $stateParams.step ? $stateParams.step - 1 : 0;
  $scope.$watch((function() {
    return Docs.list;
  }), function() {
    $scope.doc = Docs.find($stateParams.permalink);
    if ($scope.doc) {
      $scope.step = $scope.doc.steps[$scope.index];
      $scope.step.url = $sce.trustAsResourceUrl($scope.step.url);
      if ($scope.step.type === 'dialog') {
        $scope.messageIndex = 0;
        $scope.messages = [];
        return $timeout($scope.nextMessage, 1000);
      }
    }
  });
  return $scope.hasMoreSteps = function() {
    if ($scope.step) {
      return $scope.step.index < $scope.doc.steps.length;
    }
  };
});

Franchino.directive('mySlideshow', function() {
  return {
    restrict: 'AC',
    link: function(scope, element, attrs) {
      var config;
      config = angular.extend({
        slides: '.slide'
      }, scope.$eval(attrs.mySlideshow));
      return setTimeout((function() {
        return $(element).cycle(function() {
          return {
            fx: 'fade',
            speed: 'fast',
            next: '#next2',
            prev: '#prev2',
            caption: '#alt-caption',
            caption_template: '{{images.alt}}',
            pause_on_hover: 'true'
          };
        });
      }), 0);
    }
  };
});

var AUTH0_CALLBACK_URL, AUTH0_CLIENT_ID, AUTH0_DOMAIN;

AUTH0_CLIENT_ID = 'A126XWdJZY715w3B6yVCevpS8tYmPJrj';

AUTH0_DOMAIN = 'footbros.auth0.com';

AUTH0_CALLBACK_URL = location.href;

window.Franchino = angular.module('tap.controllers', []);

Franchino.controller('LoginCtrl', function($scope, auth, $state, store) {
  var doAuth;
  doAuth = function() {
    auth.signin({
      closable: false,
      authParams: {
        scope: 'openid offline_access'
      }
    }, (function(profile, idToken, accessToken, state, refreshToken) {
      store.set('profile', profile);
      store.set('token', idToken);
      store.set('refreshToken', refreshToken);
      $state.go('app.home');
    }), function(error) {
      console.log('There was an error logging in', error);
    });
  };
  $scope.$on('$ionic.reconnectScope', function() {
    doAuth();
  });
  doAuth();
});

Franchino.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
  $scope.startApp = function() {
    return $state.go('app.products');
  };
  $scope.next = function() {
    return $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    return $ionicSlideBoxDelegate.previous();
  };
  $scope.slideChanged = function(index) {
    return $scope.slideIndex = index;
  };
});

Franchino.controller('AppCtrl', function($scope) {});

Franchino.controller('DashCtrl', function($scope, $http) {
  $scope.callApi = function() {
    $http({
      url: 'http://auth0-nodejsapi-sample.herokuapp.com/secured/ping',
      method: 'GET'
    }).then((function() {
      alert('We got the secured data successfully');
    }), function() {
      alert('Please download the API seed so that you can call it.');
    });
  };
});

angular.module("tap.directives", []).directive("device", function() {
  return {
    restrict: "A",
    link: function() {
      return device.init();
    }
  };
}).service('copy', function($sce) {
  var copy, trustValues;
  copy = {
    about: {
      heading: "We're <strong>tapping</strong> into the future",
      sub_heading: "Tapcentive was created by a team that has lived the mobile commerce revolution from the earliest days of mCommerce with WAP, to leading the charge in mobile payments and services with NFC worldwide.",
      copy: "<p>For us, mobile commerce has always been about much more than payment:  marketing, promotions, product content, and loyalty, all come to life inside a mobile phone. Mobile commerce really gets interesting when it bridges the digital and physical worlds.</p><p>Our goal at Tapcentive is to create a state-of-the-art mobile engagement platform that enables marketers and developers to create entirely new customer experiences in physical locations – all with a minimum amount of technology development.</p><p>We think you’ll like what we’ve built so far. And just as mobile technology is constantly evolving, so is the Tapcentive platform. Give it a test drive today.</p>"
    },
    team: {
      heading: "",
      bios: {
        dave_role: "",
        dave_copy: ""
      }
    }
  };
  trustValues = function(values) {
    return _.each(values, function(val, key) {
      switch (typeof val) {
        case 'string':
          return $sce.trustAsHtml(val);
        case 'object':
          return trustValues(val);
      }
    });
  };
  trustValues(copy);
  return copy;
});

var $, cssId, head, link;

if (device.desktop()) {

} else if (device.mobile()) {
  $ = document;
  cssId = 'myCss';
  if (!$.getElementById(cssId)) {
    head = $.getElementsByTagName('head')[0];
    link = $.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = '/css/ionic.app.min.css';
    link.media = 'all';
    head.appendChild(link);
  }
}

window.Franchino = angular.module('tap.product', []);

Franchino.factory('Product', function($http, $rootScope) {
  return {
    all: function(queryString) {
      return $http.get($rootScope.server + '/products', {
        params: queryString
      });
    }
  };
});

Franchino.controller('ProductListCtrl', function($scope, $rootScope, $ionicScrollDelegate, $ionicSideMenuDelegate, Product) {
  var page, pageSize, productCount;
  $scope.products = [];
  pageSize = 20;
  productCount = 1;
  page = 0;
  $scope.clearSearch = function() {
    $scope.searchKey = '';
    $scope.loadData();
  };
  $rootScope.$on('searchKeyChange', function(event, searchKey) {
    $scope.searchKey = searchKey;
    $scope.loadData();
  });
  $scope.formatAlcoholLevel = function(val) {
    return parseFloat(val);
  };
  $scope.loadData = function() {
    var range;
    page = 1;
    range = 1;
    Product.all({
      search: $scope.searchKey,
      min: range[0],
      max: range[1],
      page: page,
      pageSize: pageSize
    }).success(function(result) {
      $scope.products = result.products;
      productCount = result.total;
      $ionicScrollDelegate.$getByHandle('myScroll').getScrollView().scrollTo(0, 0, true);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
  $scope.loadMoreData = function() {
    var range;
    page++;
    range = 1;
    Product.all({
      search: $scope.searchKey,
      min: range[0],
      max: range[1],
      page: page,
      pageSize: pageSize
    }).success(function(result) {
      productCount = result.total;
      Array.prototype.push.apply($scope.products, result.products);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
  $scope.isMoreData = function() {
    return page < productCount / pageSize;
  };
});

Franchino.controller('ProductDetailCtrl', function($scope, $rootScope, $state, $stateParams, $sce, Product, $ionicHistory) {
  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
  $scope.product = {
    name: $stateParams.name,
    brewery: $stateParams.brewery,
    alcohol: $stateParams.alcohol,
    video: $stateParams.video,
    tags: $stateParams.tags
  };
  $scope.tags = $scope.product.tags.split(', ');
  $scope.setSearchKey = function(searchKey) {
    $rootScope.$emit('searchKeyChange', searchKey);
    $state.go('products');
  };
  $scope.formatAlcoholLevel = function(val) {
    return '' + parseFloat(val) + '%';
  };
  $scope.formatYoutubeUrl = function(val) {
    $scope.currentUrl = 'https://www.youtube.com/embed/' + val + '';
    $scope.betterUrl = $sce.trustAsResourceUrl($scope.currentUrl);
    return $scope.betterUrl;
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiLCJhdXRoMC12YXJpYWJsZXMuY29mZmVlIiwiY29udHJvbGxlcnMuY29mZmVlIiwiZGlyZWN0aXZlcy5jb2ZmZWUiLCJpbml0LmNvZmZlZSIsInByb2R1Y3QuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUcsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFIO0FBQ0UsRUFBQSxNQUFNLENBQUMsU0FBUCxHQUFtQixPQUFPLENBQUMsTUFBUixDQUFlLFdBQWYsRUFBNEIsQ0FBQyxZQUFELEVBQWUsV0FBZixFQUE0QixrQkFBNUIsRUFBZ0QsaUJBQWhELEVBQW1FLGdCQUFuRSxDQUE1QixDQUFuQixDQURGO0NBQUEsTUFBQTtBQUlFLEVBQUEsTUFBTSxDQUFDLFNBQVAsR0FBbUIsT0FBTyxDQUFDLE1BQVIsQ0FBZSxXQUFmLEVBQTRCLENBQUUsT0FBRixFQUM3QyxrQkFENkMsRUFFN0MsaUJBRjZDLEVBRzdDLGdCQUg2QyxFQUk3QyxhQUo2QyxFQUs3QyxPQUw2QyxFQU03QyxpQkFONkMsRUFPN0MsYUFQNkMsQ0FBNUIsQ0FBbkIsQ0FKRjtDQUFBOztBQUFBLFNBYVMsQ0FBQyxHQUFWLENBQWMsU0FBQyxjQUFELEVBQWlCLFVBQWpCLEdBQUE7QUFDWixFQUFBLFVBQVUsQ0FBQyxNQUFYLEdBQW9CLHVCQUFwQixDQUFBO0FBQUEsRUFDQSxjQUFjLENBQUMsS0FBZixDQUFxQixTQUFBLEdBQUE7QUFDakIsSUFBQSxJQUFHLE1BQU0sQ0FBQyxTQUFWO0FBQ0UsTUFBQSxTQUFTLENBQUMsWUFBVixDQUFBLENBQUEsQ0FERjtLQUFBO0FBSUEsSUFBQSxJQUFHLE1BQU0sQ0FBQyxPQUFQLElBQW1CLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQTdDO0FBQ0UsTUFBQSxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyx3QkFBekIsQ0FBa0QsSUFBbEQsQ0FBQSxDQURGO0tBSkE7QUFNQSxJQUFBLElBQUcsTUFB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QUFBQSxFQVVBLE1BQU0sQ0FBQyxJQUFQLEdBQWMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBcEIsQ0FBMEIsSUFBMUIsQ0FWZCxDQUFBO0FBQUEsRUFZQSxNQUFNLENBQUMsWUFBUCxHQUFzQixTQUFDLFNBQUQsR0FBQTtBQUNwQixJQUFBLFVBQVUsQ0FBQyxLQUFYLENBQWlCLGlCQUFqQixFQUFvQyxTQUFwQyxDQUFBLENBQUE7QUFBQSxJQUNBLE1BQU0sQ0FBQyxFQUFQLENBQVUsVUFBVixDQURBLENBRG9CO0VBQUEsQ0FadEIsQ0FBQTtBQUFBLEVBaUJBLE1BQU0sQ0FBQyxrQkFBUCxHQUE0QixTQUFDLEdBQUQsR0FBQTtXQUMxQixFQUFBLEdBQUssVUFBQSxDQUFXLEdBQVgsQ0FBTCxHQUF1QixJQURHO0VBQUEsQ0FqQjVCLENBQUE7QUFBQSxFQW9CQSxNQUFNLENBQUMsZ0JBQVAsR0FBMEIsU0FBQyxHQUFELEdBQUE7QUFDeEIsSUFBQSxNQUFNLENBQUMsVUFBUCxHQUFvQixnQ0FBQSxHQUFtQyxHQUFuQyxHQUF5QyxFQUE3RCxDQUFBO0FBQUEsSUFDQSxNQUFNLENBQUMsU0FBUCxHQUFtQixJQUFJLENBQUMsa0JBQUwsQ0FBd0IsTUFBTSxDQUFDLFVBQS9CLENBRG5CLENBQUE7V0FFQSxNQUFNLENBQUMsVUFIaUI7RUFBQSxDQXBCMUIsQ0FGd0M7QUFBQSxDQUExQyxDQS9EQSxDQUFBIiwiZmlsZSI6ImFwcGxpY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaWYgZGV2aWNlLmRlc2t0b3AoKVxuICB3aW5kb3cuRnJhbmNoaW5vID0gYW5ndWxhci5tb2R1bGUoJ0ZyYW5jaGlubycsIFsnbmdTYW5pdGl6ZScsICd1aS5yb3V0ZXInLCAnYnRmb3JkLnNvY2tldC1pbycsICd0YXAuY29udHJvbGxlcnMnLCAndGFwLmRpcmVjdGl2ZXMnXSlcblxuZWxzZVxuICB3aW5kb3cuRnJhbmNoaW5vID0gYW5ndWxhci5tb2R1bGUoXCJGcmFuY2hpbm9cIiwgWyAnaW9uaWMnLFxuICAgICdidGZvcmQuc29ja2V0LWlvJyxcbiAgICAndGFwLmNvbnRyb2xsZXJzJyxcbiAgICAndGFwLmRpcmVjdGl2ZXMnLFxuICAgICd0YXAucHJvZHVjdCcsXG4gICAgJ2F1dGgwJyxcbiAgICAnYW5ndWxhci1zdG9yYWdlJyxcbiAgICAnYW5ndWxhci1qd3QnXSlcblxuRnJhbmNoaW5vLnJ1biAoJGlvbmljUGxhdGZvcm0sICRyb290U2NvcGUpIC0+XG4gICRyb290U2NvcGUuc2VydmVyID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMCdcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkgLT5cbiAgICAgIGlmIHdpbmRvdy5TdGF0dXNCYXJcbiAgICAgICAgU3RhdHVzQmFyLnN0eWxlRGVmYXVsdCgpXG4gICAgICAjIEhpZGUgdGhlIGFjY2Vzc29yeSBiYXIgYnkgZGVmYXVsdCAocmVtb3ZlIHRoaXMgdG8gc2hvdyB0aGUgYWNjZXNzb3J5IGJhciBhYm92ZSB0aGUga2V5Ym9hcmRcbiAgICAgICMgZm9yIGZvcm0gaW5wdXRzKVxuICAgICAgaWYgd2luZG93LmNvcmRvdmEgYW5kIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmRcbiAgICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmhpZGVLZXlib2FyZEFjY2Vzc29yeUJhciB0cnVlXG4gICAgICBpZiB3aW5kb3cuU3RhdHVzQmFyXG4gICAgICAgICMgb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxuICAgICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KClcbiAgICAgIHJldHVyblxuICAgIHJldHVyblxuXG5cbkZyYW5jaGluby5jb25maWcgKCRzY2VEZWxlZ2F0ZVByb3ZpZGVyKSAtPlxuICAkc2NlRGVsZWdhdGVQcm92aWRlci5yZXNvdXJjZVVybFdoaXRlbGlzdCBbXG4gICAgICAnc2VsZidcbiAgICAgIG5ldyBSZWdFeHAoJ14oaHR0cFtzXT8pOi8vKHd7M30uKT95b3V0dWJlLmNvbS8uKyQnKVxuICAgIF1cbiAgcmV0dXJuXG5cblxuRnJhbmNoaW5vLmNvbmZpZyAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICRodHRwUHJvdmlkZXIsIGF1dGhQcm92aWRlciwgand0SW50ZXJjZXB0b3JQcm92aWRlcikgLT5cblxuICAkc3RhdGVQcm92aWRlclxuXG4gICAgLnN0YXRlICdhcHAnLFxuICAgICAgdXJsOiAnJ1xuICAgICAgYWJzdHJhY3Q6IHRydWVcbiAgICAgIGNvbnRyb2xsZXI6ICdBcHBDdHJsJ1xuICAgICAgdGVtcGxhdGVVcmw6ICdtZW51Lmh0bWwnXG5cbiAgICAuc3RhdGUoJ2xvZ2luJyxcbiAgICAgIHVybDogJy9sb2dpbidcbiAgICAgIHRlbXBsYXRlVXJsOiAnbG9naW4uaHRtbCdcbiAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnKVxuICAgIFxuICAgIC5zdGF0ZSgnYXBwLnByb2R1Y3RzJyxcbiAgICAgIHVybDogJy9wcm9kdWN0cydcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3Byb2R1Y3QtbGlzdC5odG1sJ1xuICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0TGlzdEN0cmwnKVxuICAgIFxuICAgIC5zdGF0ZSAnYXBwLnByb2R1Y3QtZGV0YWlsJyxcbiAgICAgIHVybDogJy9wcm9kdWN0LzpuYW1lLzpicmV3ZXJ5LzphbGNvaG9sLzp0YWdzLzp2aWRlbydcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3Byb2R1Y3QtZGV0YWlsLmh0bWwnXG4gICAgICAgICAgY29udHJvbGxlcjogJ1Byb2R1Y3REZXRhaWxDdHJsJ1xuICAgICAgICAgIFxuICAgIC5zdGF0ZSAnYXBwLmludHJvJyxcbiAgICAgIHVybDogJy9pbnRybycsXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0ludHJvQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2ludHJvLmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5ob21lJyxcbiAgICAgIHVybDogJy9ob21lJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2hvbWUuaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmRvY3MnLFxuICAgICAgdXJsOiAnL2RvY3MnXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0RvY3NDdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZG9jcy9pbmRleC5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuYWJvdXQnLFxuICAgICAgdXJsOiAnL2Fib3V0J1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdBYm91dEN0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhYm91dC5odG1sJ1xuXG5cbiAgICAuc3RhdGUgJ2FwcC5ibG9nJyxcbiAgICAgIHVybDogJy9ibG9nJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdCbG9nQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2Jsb2cuaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLnJlc3VtZScsXG4gICAgICB1cmw6ICcvcmVzdW1lJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXN1bWVDdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAncmVzdW1lLmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5jb250YWN0JyxcbiAgICAgIHVybDogJy9jb250YWN0J1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdDb250YWN0Q3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbnRhY3QuaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmRvYycsXG4gICAgICB1cmw6ICcvZG9jcy86cGVybWFsaW5rJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdEb2NDdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZG9jcy9zaG93Lmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5zdGVwJyxcbiAgICAgIHVybDogJy9kb2NzLzpwZXJtYWxpbmsvOnN0ZXAnXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0RvY0N0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdkb2NzL3Nob3cuaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmpvYi10YXBjZW50aXZlJyxcbiAgICAgIHVybDogJy9qb2ItdGFwY2VudGl2ZSdcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnSm9iVGFwY2VudGl2ZUN0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdqb2ItdGFwY2VudGl2ZS5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuam9iLXRhcGNlbnRpdmUtdHdvJyxcbiAgICAgIHVybDogJy9qb2ItdGFwY2VudGl2ZS10d28nXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0pvYlRhcGNlbnRpdmVUd29DdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnam9iLXRhcGNlbnRpdmUtdHdvLmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5qb2ItY3BnaW8nLFxuICAgICAgdXJsOiAnL2pvYi1jcGdpbydcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnSm9iQ3BnaW9DdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnam9iLWNwZ2lvLmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5qb2ItbWVkeWNhdGlvbicsXG4gICAgICB1cmw6ICcvam9iLW1lZHljYXRpb24nXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0pvYk1lZHljYXRpb25DdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnam9iLW1lZHljYXRpb24uaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmpvYi1jc3QnLFxuICAgICAgdXJsOiAnL2pvYi1jc3QnXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0pvYkNzdEN0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdqb2ItY3N0Lmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5qb2Ita291cG4nLFxuICAgICAgdXJsOiAnL2pvYi1rb3VwbidcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnSm9iS291cG5DdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnam9iLWtvdXBuLmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5qb2ItdHJvdW5kJyxcbiAgICAgIHVybDogJy9qb2ItdHJvdW5kJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdKb2JUcm91bmRDdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnam9iLXRyb3VuZC5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuam9iLW1vbnRobHlzJyxcbiAgICAgIHVybDogJy9qb2ItbW9udGhseXMnXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0pvYk1vbnRobHlzQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2pvYi1tb250aGx5cy5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuam9iLW1vbnRobHlzLXR3bycsXG4gICAgICB1cmw6ICcvam9iLW1vbnRobHlzLXR3bydcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnSm9iTW9udGhseXNUd29DdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnam9iLW1vbnRobHlzLXR3by5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuam9iLWJlbmNocHJlcCcsXG4gICAgICB1cmw6ICcvam9iLWJlbmNocHJlcCdcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnSm9iQmVuY2hwcmVwQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2pvYi1iZW5jaHByZXAuaHRtbCdcblxuICAgICAgICAjIENvbmZpZ3VyZSBBdXRoMFxuICAgICAgYXV0aFByb3ZpZGVyLmluaXRcbiAgICAgICAgZG9tYWluOiBBVVRIMF9ET01BSU5cbiAgICAgICAgY2xpZW50SUQ6IEFVVEgwX0NMSUVOVF9JRFxuICAgICAgICBsb2dpblN0YXRlOiAncHJvZHVjdHMnXG5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlIFwiL3Byb2R1Y3RzXCJcblxuICAgIGp3dEludGVyY2VwdG9yUHJvdmlkZXIudG9rZW5HZXR0ZXIgPSAoc3RvcmUsIGp3dEhlbHBlciwgYXV0aCkgLT5cbiAgICAgIGlkVG9rZW4gPSBzdG9yZS5nZXQoJ3Rva2VuJylcbiAgICAgIHJlZnJlc2hUb2tlbiA9IHN0b3JlLmdldCgncmVmcmVzaFRva2VuJylcbiAgICAgIGlmICFpZFRva2VuIG9yICFyZWZyZXNoVG9rZW5cbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIGlmIGp3dEhlbHBlci5pc1Rva2VuRXhwaXJlZChpZFRva2VuKVxuICAgICAgICBhdXRoLnJlZnJlc2hJZFRva2VuKHJlZnJlc2hUb2tlbikudGhlbiAoaWRUb2tlbikgLT5cbiAgICAgICAgICBzdG9yZS5zZXQgJ3Rva2VuJywgaWRUb2tlblxuICAgICAgICAgIGlkVG9rZW5cbiAgICAgIGVsc2VcbiAgICAgICAgaWRUb2tlblxuXG4gICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoICdqd3RJbnRlcmNlcHRvcidcbiAgICAgIHJldHVyblxuXG4gICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCAtPlxuICAgICAgIHJlcXVlc3Q6IChjb25maWcpIC0+XG4gICAgICAgICBpZiBjb25maWcudXJsLm1hdGNoKC9cXC5odG1sJC8pICYmICFjb25maWcudXJsLm1hdGNoKC9ec2hhcmVkXFwvLylcbiAgICAgICAgICAgaWYgZGV2aWNlLnRhYmxldCgpXG4gICAgICAgICAgICAgdHlwZSA9ICd0YWJsZXQnXG4gICAgICAgICAgIGVsc2UgaWYgZGV2aWNlLm1vYmlsZSgpXG4gICAgICAgICAgICAgdHlwZSA9ICdtb2JpbGUnXG4gICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICB0eXBlID0gJ2Rlc2t0b3AnXG5cbiAgICAgICAgICAgY29uZmlnLnVybCA9IFwiLyN7dHlwZX0vI3tjb25maWcudXJsfVwiXG5cbiAgICAgICAgIGNvbmZpZ1xuXG5GcmFuY2hpbm8ucnVuICgkcm9vdFNjb3BlLCBhdXRoLCBzdG9yZSkgLT5cbiAgJHJvb3RTY29wZS4kb24gJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgLT5cbiAgICBpZiAhYXV0aC5pc0F1dGhlbnRpY2F0ZWRcbiAgICAgIHRva2VuID0gc3RvcmUuZ2V0KCd0b2tlbicpXG4gICAgICBpZiB0b2tlblxuICAgICAgICBhdXRoLmF1dGhlbnRpY2F0ZSBzdG9yZS5nZXQoJ3Byb2ZpbGUnKSwgdG9rZW5cbiAgICByZXR1cm5cbiAgcmV0dXJuXG5cblxuRnJhbmNoaW5vLnJ1biAoJHN0YXRlKSAtPlxuICAkc3RhdGUuZ28oJ2FwcC5ob21lJylcblxuRnJhbmNoaW5vLnJ1biAoJHJvb3RTY29wZSwgY29weSkgLT5cbiAgJHJvb3RTY29wZS5jb3B5ID0gY29weVxuXG5GcmFuY2hpbm8uZmFjdG9yeSAnU29ja2V0JywgKHNvY2tldEZhY3RvcnkpIC0+XG4gIHNvY2tldEZhY3RvcnkoKVxuXG5GcmFuY2hpbm8uZmFjdG9yeSAnRG9jcycsIChTb2NrZXQpIC0+XG4gIHNlcnZpY2UgPVxuICAgIGxpc3Q6IFtdXG4gICAgZmluZDogKHBlcm1hbGluaykgLT5cbiAgICAgIF8uZmluZCBzZXJ2aWNlLmxpc3QsIChkb2MpIC0+XG4gICAgICAgIGRvYy5wZXJtYWxpbmsgPT0gcGVybWFsaW5rXG5cbiAgU29ja2V0Lm9uICdkb2NzJywgKGRvY3MpIC0+XG4gICAgc2VydmljZS5saXN0ID0gZG9jc1xuXG4gIHNlcnZpY2VcblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0hvbWVDdHJsJywgKCRzY29wZSkgLT5cbiAgXG5GcmFuY2hpbm8uY29udHJvbGxlciAnQ29udGFjdFNoZWV0Q3RybCcsICgkc2NvcGUsICRpb25pY0FjdGlvblNoZWV0KSAtPlxuICAkc2NvcGUuc2hvd0FjdGlvbnNoZWV0ID0gLT5cbiAgICAkaW9uaWNBY3Rpb25TaGVldC5zaG93XG4gICAgICB0aXRsZVRleHQ6IFwiQ29udGFjdCBGcmFuY2hpbm9cIlxuICAgICAgYnV0dG9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCJHaXRodWIgPGkgY2xhc3M9XFxcImljb24gaW9uLXNoYXJlXFxcIj48L2k+XCJcbiAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCJFbWFpbCBNZSA8aSBjbGFzcz1cXFwiaWNvbiBpb24tZW1haWxcXFwiPjwvaT5cIlxuICAgICAgICB9XG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiBcIlR3aXR0ZXIgPGkgY2xhc3M9XFxcImljb24gaW9uLXNvY2lhbC10d2l0dGVyXFxcIj48L2k+XCJcbiAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCIyMjQtMjQxLTkxODkgPGkgY2xhc3M9XFxcImljb24gaW9uLWlvcy10ZWxlcGhvbmVcXFwiPjwvaT5cIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgICBjYW5jZWxUZXh0OiBcIkNhbmNlbFwiXG4gICAgICBjYW5jZWw6IC0+XG4gICAgICAgIGNvbnNvbGUubG9nIFwiQ0FOQ0VMTEVEXCJcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGJ1dHRvbkNsaWNrZWQ6IChpbmRleCkgLT5cbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIjIyNC0yNDEtOTE4OVwiICBpZiBpbmRleCBpcyAyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCJodHRwOi8vdHdpdHRlci5jb20vZnJhbmNoaW5vX2NoZVwiICBpZiBpbmRleCBpcyAyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCJtYWlsdG86ZnJhbmNoaW5vLm5vbmNlQGdtYWlsLmNvbVwiICBpZiBpbmRleCBpcyAxXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCJodHRwOi8vZ2l0aHViLmNvbS9mcmFuZ3VjY1wiICBpZiBpbmRleCBpcyAwXG4gICAgICAgIHRydWVcblxuICByZXR1cm5cbkZyYW5jaGluby5jb250cm9sbGVyIFwiU2xpZGVzVGFwT25lQ3RybFwiLCAoJHNjb3BlKSAtPlxuICAkc2NvcGUuZGF0ZSA9ICdOT1ZFTUJFUiAyMDE0J1xuICAkc2NvcGUudGl0bGUgPSAnVGFwY2VudGl2ZSBtYW5hZ2VyIFVYIG92ZXJoYXVsIGFuZCBmcm9udC1lbmQnXG4gICRzY29wZS5pbWFnZXMgPSBbXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiVGFwY2VudGl2ZS5jb20gVVggb3ZlcmhhdWwgYW5kIFNQQSBmcm9udC1lbmRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZ2lmL3JlcG9ydC5naWZcIixcbiAgICAgIFwidGV4dFwiIDogXCI8cD5TdHVkeSB0aGUgdXNlciBhbmQgdGhlaXIgZ29hbHMgYW5kIG92ZXJoYXVsIHRoZSBleHBlcmllbmNlIHdoaWxlIHJlLXdyaXRpbmcgdGhlIGZyb250LWVuZCBpbiBBbmd1bGFyLjwvcD48YSBocmVmPSdodHRwOi8vdGFwY2VudGl2ZS5jb20nIHRhcmdldD0nX2JsYW5rJz5WaXNpdCBXZWJzaXRlPC9hPlwiXG4gICAgfVxuICBdXG5cbkZyYW5jaGluby5jb250cm9sbGVyIFwiU2xpZGVzVGFwVHdvQ3RybFwiLCAoJHNjb3BlKSAtPlxuICAkc2NvcGUuZGF0ZSA9ICdPQ1RPQkVSIDIwMTQnXG4gICRzY29wZS50aXRsZSA9ICdEZXNrdG9wIGFuZCBtb2JpbGUgd2ViIGZyaWVuZGx5IG1hcmtldGluZyB3ZWJzaXRlJyBcbiAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby10YXBjZW50aXZlLXllbGxvdy5qcGdcIixcbiAgICAgIFwidGV4dFwiIDogXCI8cD5DcmVhdGUgYSBrbm9ja291dCBicmFuZCBzdHJhdGVneSB3aXRoIGFuIGF3ZXNvbWUgbG9vayBhbmQgZmVlbC4gTWFrZSBhIHNvcGhpc3RpY2F0ZWQgb2ZmZXJpbmcgbG9vayBzaW1wbGUgYW5kIGVhc3kgdG8gdXNlLjwvcD48YSBocmVmPSdodHRwOi8vdGFwY2VudGl2ZS5jb20nIHRhcmdldD0nX2JsYW5rJz5WaXNpdCBXZWJzaXRlPC9hPlwiXG4gICAgfVxuXG4gIF1cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgXCJTbGlkZXNDcGdDdHJsXCIsICgkc2NvcGUpIC0+XG4gICRzY29wZS5kYXRlID0gJ0pVTFkgMjAxNCdcbiAgJHNjb3BlLnRpdGxlID0gJ0lkZW50aXR5LCBmdWxsLXN0YWNrIE1WUCwgYW5kIG1hcmtldGluZyB3ZWJzaXRlIGZvciBhIG5ldyBDUEcgZURpc3RyaWJ1dGlvbiBjb21wYW55JyBcbiAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaW5vX2NwZ2lvLmpwZ1wiLFxuICAgICAgXCJ0ZXh0XCIgOiBcIjxwPlR1cm4gYW4gb2xkIHNjaG9vbCBDUEcgYnVzaW5lc3MgaW50byBhIHNvcGhpc3RpY2F0ZWQgdGVjaG5vbG9neSBjb21wYW55LiBEZXNpZ24gc2VjdXJlLCBhdXRvbWF0ZWQgYW5kIHRyYW5zZm9ybWF0aXZlIHBsYXRmb3JtLCB0ZWNobmljYWwgYXJjaGl0ZWN0dXJlIGFuZCBleGVjdXRlIGFuIE1WUCBlbm91Z2ggdG8gYXF1aXJlIGZpcnN0IGN1c3RvbWVycy4gTWlzc2lvbiBhY2NvbXBsaXNoZWQuPC9wPjxhIGhyZWY9J2h0dHA6Ly9jcGcuaW8nIHRhcmdldD0nX2JsYW5rJz5WaXNpdCBXZWJzaXRlPC9hPlwiXG4gICAgfVxuICBdXG5cbkZyYW5jaGluby5jb250cm9sbGVyIFwiU2xpZGVzTWVkeWNhdGlvbkN0cmxcIiwgKCRzY29wZSkgLT5cbiAgJHNjb3BlLmRhdGUgPSAnQVBSSUwgMjAxNCdcbiAgJHNjb3BlLnRpdGxlID0gJ1VzZXIgZXhwZXJpZW5jZSBkZXNpZ24gYW5kIHJhcGlkIHByb3RvdHlwaW5nIGZvciBNZWR5Y2F0aW9uLCBhIG5ldyBoZWFsdGhjYXJlIHByaWNlIGNvbXBhcmlzb24gd2Vic2l0ZSdcbiAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1tZWR5Y2F0aW9uLmpwZ1wiLFxuICAgICAgXCJ0ZXh0XCIgOiBcIjxwPldhbHR6IHVwIGluIHRoZSBvbmxpbmUgaGVhbHRoY2FyZSBpbmR1c3RyeSBndW5zIGJsYXppbmcgd2l0aCBraWxsZXIgZGVzaWduIGFuZCBpbnN0aW5jdHMuIEdldCB0aGlzIG5ldyBjb21wYW55IG9mZiB0aGUgZ3JvdW5kIHdpdGggaXQncyBNVlAuIFN3aXBlIGZvciBtb3JlIHZpZXdzLjwvcD48YSBocmVmPSdodHRwOi8vbWVkeWNhdGlvbi5jb20nIHRhcmdldD0nX2JsYW5rJz5WaXNpdCBXZWJzaXRlPC9hPlwiXG4gICAgfSxcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1tZWR5Y2F0aW9uMi5qcGdcIixcbiAgICAgIFwidGV4dFwiIDogXCJcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm8tbWVkeWNhdGlvbjMuanBnXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLW1lZHljYXRpb240LmpwZ1wiXG4gICAgfSxcbiAgXVxuXG5GcmFuY2hpbm8uY29udHJvbGxlciBcIlNsaWRlc0NTVEN0cmxcIiwgKCRzY29wZSkgLT5cbiAgJHNjb3BlLmRhdGUgPSAnQVBSSUwgMjAxNCdcbiAgJHNjb3BlLnRpdGxlID0gJ0Rlc2lnbmVkIGFuZCBkZXZlbG9wZWQgYSBuZXcgdmVyc2lvbiBvZiB0aGUgQ2hpY2FnbyBTdW4gVGltZXMgdXNpbmcgYSBoeWJyaWQgSW9uaWMvQW5ndWxhciBzdGFjaydcbiAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1jc3QuanBnXCIsXG4gICAgICBcInRleHRcIiA6IFwiPHA+SGVscCB0aGUgc3RydWdnbGluZyBtZWRpYSBnaWFudCB1cGdyYWRlIHRoZWlyIGNvbnN1bWVyIGZhY2luZyB0ZWNobm9sb2d5LiBDcmVhdGUgb25lIGNvZGUgYmFzZSBpbiBBbmd1bGFyIGNhcGFibGUgb2YgZ2VuZXJhdGluZyBraWNrLWFzcyBleHBlcmllbmNlcyBmb3IgbW9iaWxlLCB0YWJsZXQsIHdlYiBhbmQgVFYuXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLWNzdDIuanBnXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLWNzdDMuanBnXCJcbiAgICB9LFxuICBdXG5cbkZyYW5jaGluby5jb250cm9sbGVyIFwiU2xpZGVzS291cG5DdHJsXCIsICgkc2NvcGUpIC0+XG4gICRzY29wZS5kYXRlID0gJ01BUkNIIDIwMTQnXG4gICRzY29wZS50aXRsZSA9ICdCcmFuZCByZWZyZXNoLCBtYXJrZXRpbmcgc2l0ZSBhbmQgcGxhdGZvcm0gZXhwZXJpZW5jZSBvdmVyaGF1bCdcbiAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1rb3VwbjEuanBnXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLWtvdXBuMi5qcGdcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm8ta291cG4uanBnXCJcbiAgICB9LFxuICBdXG5cbkZyYW5jaGluby5jb250cm9sbGVyIFwiU2xpZGVzVHJvdW5kQ3RybFwiLCAoJHNjb3BlKSAtPlxuICAkc2NvcGUuZGF0ZSA9ICdBVUdVU1QgMjAxMydcbiAgJHNjb3BlLnRpdGxlID0gJ1NvY2lhbCB0cmF2ZWwgbW9iaWxlIGFwcCBkZXNpZ24sIFVYIGFuZCByYXBpZCBwcm90b3R5cGluZydcbiAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaW5vX3Ryb3VuZC5qcGdcIixcbiAgICAgIFwidGV4dFwiIDogXCJEZXNpZ24gYW4gSW5zdGFncmFtIGJhc2VkIHNvY2lhbCB0cmF2ZWwgYXBwLiBXaHk/IEkgZG9uJ3Qga25vdy5cIlxuICAgIH1cbiAgXVxuXG5GcmFuY2hpbm8uY29udHJvbGxlciBcIlNsaWRlc01vbnRobHlzQ3RybFwiLCAoJHNjb3BlKSAtPlxuICAkc2NvcGUuZGF0ZSA9ICdGRUJSVUFSWSAyMDEzJ1xuICAkc2NvcGUudGl0bGUgPSAnQ3VzdG9tZXIgcG9ydGFsIHBsYXRmb3JtIFVYIGRlc2lnbiBhbmQgZnJvbnQtZW5kJ1xuICAkc2NvcGUuaW1hZ2VzID0gW1xuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLW1vbnRobHlzLWJpejIuanBnXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vX21vbnRobHlzLmpwZ1wiXG4gICAgfVxuICBdXG5cbkZyYW5jaGluby5jb250cm9sbGVyIFwiU2xpZGVzTW9udGhseXNUd29DdHJsXCIsICgkc2NvcGUpIC0+XG4gICRzY29wZS5kYXRlID0gJ01BUkNIIDIwMTInXG4gICRzY29wZS50aXRsZSA9ICdFbnRyZXByZW5ldXIgaW4gcmVzaWRlbmNlIGF0IExpZ2h0YmFuaydcbiAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1tb250aGx5czcuanBnXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLW1vbnRobHlzNS5qcGdcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm8tbW9udGhseXMyLmpwZ1wiXG4gICAgfVxuICBdXG5cbkZyYW5jaGluby5jb250cm9sbGVyIFwiQmxvZ0N0cmxcIiwgKCRzY29wZSkgLT5cblxuICAkc2NvcGUuYXJ0aWNsZXMgPSBbXG4gICAge1xuICAgICAgXCJkYXRlXCIgOiBcIlBvc3RlZCBieSBGcmFuY2hpbm8gb24gRGVjZW1iZXIgMTIsIDIwMTRcIixcbiAgICAgIFwiaGVhZGluZ1wiIDogXCJNeSBwYXRoIHRvIGxlYXJuaW5nIFN3aWZ0XCIsXG4gICAgICBcImF1dGhvcmltZ1wiIDogXCIvaW1nL2ZyYW5rLnBuZ1wiLFxuICAgICAgXCJpbWdcIiA6IFwiL2ltZy9kZWMvbmV3c2xldHRlci1zd2lmdHJpcy1oZWFkZXIuZ2lmXCIsXG4gICAgICBcImJsb2JcIiA6IFwiSSd2ZSBiZWVuIGFuIE1WQyBkZXZlbG9wZXIgaW4gZXZlcnkgbGFuZ3VhZ2UgZXhjZXB0IGZvciBpT1MuIFRoaXMgcGFzdCBPY3RvYmVyLCBJIHRvb2sgbXkgZmlyc3QgcmVhbCBkZWVwIGRpdmUgaW50byBpT1MgcHJvZ3JhbW1pbmcgYW5kIHN0YXJ0ZWQgd2l0aCBTd2lmdC4gVGhlcmUgYXJlIHR3byBncmVhdCB0dXRvcmlhbHMgb3V0IHRoZXJlLiBUaGUgZmlyc3QgaXMgZnJvbSBibG9jLmlvIGFuZCBpcyBmcmVlLiBJdCdzIGEgZ2FtZSwgU3dpZnRyaXMsIHNvIGdldCByZWFkeSBmb3Igc29tZSBhY3Rpb24uIFRoZSBzZWNvbmQgd2lsbCBoZWxwIHlvdSBidWlsZCBzb21ldGhpbmcgbW9yZSBhcHBpc2gsIGl0J3MgYnkgQXBwY29kYS4gR290IHRoZWlyIGJvb2sgYW5kIHdpbGwgYmUgZG9uZSB3aXRoIGl0IHRoaXMgd2Vlay4gU28gZmFyLCBib29rcyBvaywgYnV0IGl0IG1vdmVzIHJlYWxseSBzbG93LlwiLFxuICAgICAgXCJyZXNvdXJjZTFcIiA6IFwiaHR0cHM6Ly93d3cuYmxvYy5pby9zd2lmdHJpcy1idWlsZC15b3VyLWZpcnN0LWlvcy1nYW1lLXdpdGgtc3dpZnRcIixcbiAgICAgIFwicmVzb3VyY2UyXCIgOiBcImh0dHA6Ly93d3cuYXBwY29kYS5jb20vc3dpZnQvXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZGF0ZVwiIDogXCJQb3N0ZWQgYnkgRnJhbmNoaW5vIG9uIERlY2VtYmVyIDExLCAyMDE0XCIsXG4gICAgICBcImhlYWRpbmdcIiA6IFwiV2h5IEkgZ2V0IGdvb3NlIGJ1bXBzIHdoZW4geW91IHRhbGsgYWJvdXQgYXV0b21hdGVkIGVtYWlsIG1hcmtldGluZyBhbmQgc2VnbWVudGF0aW9uIGFuZCBjdXN0b21lci5pbyBhbmQgdGhpbmdzIGxpa2UgdGhhdC5cIixcbiAgICAgIFwiYXV0aG9yaW1nXCIgOiBcIi9pbWcvZnJhbmsucG5nXCIsXG4gICAgICBcImltZ1wiIDogXCIvaW1nL2RlYy9wcmVwZW1haWxzLnBuZ1wiLFxuICAgICAgXCJibG9iXCIgOiBcIkkgZ2V0IHRlYXJ5IGV5ZWQgd2hlbiBJIHRhbGsgYWJvdXQgbXkgd29yayBhdCBCZW5jaFByZXAuY29tLiBJbiBzaG9ydCwgSSB3YXMgdGhlIGZpcnN0IGVtcGxveWVlIGFuZCBoZWxwZWQgdGhlIGNvbXBhbnkgZ2V0IHRvIHRoZWlyIHNlcmllcyBCIG5lYXIgdGhlIGVuZCBvZiB5ZWFyIHR3by4gSSBnb3QgYSBsb3QgZG9uZSB0aGVyZSwgYW5kIG9uZSBvZiB0aGUgdGhpbmdzIEkgcmVhbGx5IGVuam95ZWQgd2FzIGJ1aWxkaW5nIG91dCB0ZWNobm9sb2d5IHRvIHNlZ21lbnQgbGVhZHMsIGJyaW5nIGRpZmZlcmVudCB1c2VycyBkb3duIGRpZmZlcmVudCBjb21tdW5pY2F0aW9uIHBhdGhzIGFuZCBob3cgSSBtYXBwZWQgb3V0IHRoZSBlbnRpcmUgc3lzdGVtIHVzaW5nIGNvbXBsZXggZGlhZ3JhbXMgYW5kIHdvcmtmbG93cy4gU29tZSBvZiB0aGUgdG9vbHMgd2VyZSBidWlsdCBhbmQgYmFzZWQgb24gcXVlcyBsaWtlIFJlZGlzIG9yIFJlc3F1ZSwgb3RoZXJzIHdlIGJ1aWx0IGludG8gRXhhY3RUYXJnZXQgYW5kIEN1c3RvbWVyLmlvLiBJbiB0aGUgZW5kLCBJIGJlY2FtZSBzb21ld2hhdCBvZiBhbiBleHBlcnQgYXQgbW9uZXRpemluZyBlbWFpbHMuIFdpdGhpbiBvdXIgZW1haWwgbWFya2V0aW5nIGNoYW5uZWwsIHdlIGV4cGxvcmVkIHRhZ2dpbmcgdXNlcnMgYmFzZWQgb24gdGhlaXIgYWN0aW9ucywgc3VjaCBhcyBvcGVucyBvciBub24gb3BlbnMsIG9yIHdoYXQgdGhleSBjbGlja2VkIG9uLCB3ZSB0YXJnZWQgZW1haWwgdXNlcnMgd2hvIGhhZCBiZWVuIHRvdWNoZWQgc2V2ZW4gdGltZXMgd2l0aCBzcGVjaWFsIGlycmlzaXRhYmxlIHNhbGVzLCBiZWNhdXNlIHdlIGtub3cgYWZ0ZXIgNiB0b3VjaGVzLCB3ZSBjb3VsZCBjb252ZXJ0LiBUaGVzZSB0cmlja3Mgd2UgbGVhcm5lZCBsZWQgdG8gMjUtMzBrIGRheXMsIGFuZCBldmVudHVhbGx5LCBkYXlzIHdoZXJlIHdlIHNvbGQgMTAwayB3b3J0aCBvZiBzdWJzY3JpcHRpb25zLiBTbywgbXkgcG9pbnQ/IERvbid0IGJlIHN1cnByaXNlZCBpZiBJIGdlZWsgb3V0IGFuZCBmYWludCB3aGVuIEkgaGVhciB5b3UgdGFsayBhYm91dCB0cmFuc2FjdGlvbmFsIGVtYWlsaW5nIGFuZCBjYWRlbmNlcyBhbmQgY29uc3VtZXIgam91cm5pZXMgYW5kIHN0dWZmIGxpa2UgdGhhdC5cIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJkYXRlXCIgOiBcIlBvc3RlZCBieSBGcmFuY2hpbm8gb24gRGVjZW1iZXIgMTAsIDIwMTRcIixcbiAgICAgIFwiaGVhZGluZ1wiIDogXCJJZiBJIGNvdWxkIGhhdmUgb25lIHdpc2g7IEkgZ2V0IHRvIHVzZSB0aGlzIG1ldGhvZCB3aGVuIGRlc2lnbmluZyB5b3VyIGNvbnN1bWVyIGpvdXJuZXkgZnVubmVsLlwiLFxuICAgICAgXCJhdXRob3JpbWdcIiA6IFwiL2ltZy9mcmFuay5wbmdcIixcbiAgICAgIFwiaW1nXCIgOiBcIi9pbWcvZGVjL3V4X2JvYXJkLmpwZ1wiLFxuICAgICAgXCJibG9iXCIgOiBcIlNvIGFmdGVyIGEgYnVuY2ggb2YgZXRobm9ncmFwaGljIHN0dWRpZXMgZnJvbSBwZXJzb25hIG1hdGNoZXMgSSBnYXRoZXIgaW4tcGVyc29uLCBJIGdldCB0byBmaWxsIGEgd2FsbCB1cCB3aXRoIGtleSB0aGluZ3MgcGVvcGxlIHNhaWQsIGZlbHQsIGhlYXJkIC0gbW90aXZhdG9ycywgYmFycmllcnMsIHF1ZXN0aW9ucywgYXR0aXR1ZGVzIGFuZCBzdWNoLiBJIHRoZW4gZ3JvdXAgdGhlc2UgcG9zdC1pdCB0aG91Z2h0cyBpbiB2YXJpb3VzIHdheXMsIGxvb2tpbmcgZm9yIHBhdHRlcm5zLCBzZW50aW1lbnQsIG5ldyBpZGVhcy4gSSB0aGVuIHRha2UgdGhpcyByaWNoIGRhdGEgYW5kIGRldmVsb3AgYSB3aGF0IGNvdWxkIGJlIGJyYW5kaW5nLCBhIGxhbmRpbmcgcGFnZSBvciBhbiBlbWFpbCAtIHdpdGggd2hhdCBJIGNhbGwsIGFuIGludmVydGVkIHB5cmFtaWQgYXBwcm9hY2ggdG8gY29udGVudCwgd2hlcmUgYWRkcmVzc2luZyB0aGUgbW9zdCBpbXBvcnRhbnQgdGhpbmdzIGZvdW5kIGluIHRoZSB1c2VyIHJlc2VhcmNoIGdldCBhZGRyZXNzZWQgaW4gYSBoZXJpYXJjaGljYWwgb3JkZXIuIEkgY3JlYXRlIDUtNiBpdGVyYXRpb25zIG9mIHRoZSBsYW5kaW5nIHBhZ2UgYW5kIHJlLXJ1biB0aGVtIHRocm91Z2ggYSBzZWNvbmQgZ3JvdXAgb2YgcGFydGljaXBhbnRzLCBzdGFrZWhvbGRlcnMgYW5kIGZyaWVuZHMuIEkgdGhlbiB0YWtlIGV2ZW4gbW9yZSBub3RlcyBvbiBwZW9wbGVzIHNwZWFrLWFsb3VkIHJlYWN0aW9ucyB0byB0aGUgbGFuZGluZyBwYWdlcy4gQWZ0ZXIgdGhpcywgSSdtIHJlYWR5IHRvIGRlc2lnbiB0aGUgZmluYWwgY29weSBhbmQgcGFnZXMgZm9yIHlvdXIgZnVubmVsLlwiIFxuICAgIH0sXG4gICAge1xuICAgICAgXCJkYXRlXCIgOiBcIlBvc3RlZCBieSBGcmFuY2hpbm8gb24gRGVjZW1iZXIgOSwgMjAxNFwiLFxuICAgICAgXCJoZWFkaW5nXCIgOiBcIkRpZCBJIGV2ZW4gYmVsb25nIGhlcmU/XCIsXG4gICAgICBcImF1dGhvcmltZ1wiIDogXCIvaW1nL2ZyYW5rLnBuZ1wiLFxuICAgICAgXCJpbWdcIiA6IFwiL2ltZy9kZWMvdWNsYS5qcGdcIixcbiAgICAgIFwiYmxvYlwiIDogXCJUaGlzIGNvbWluZyB3ZWVrZW5kIHRoZXJlJ3MgcHJvYmFibHkgYSBoYWNrYXRob24gZ29pbmcgb24gaW4geW91ciBjaXR5LiBTb21lIG9mIHRoZW0gYXJlIGdldHRpbmcgcmVhbGx5IGJpZy4gSSB3YXNuJ3QgcmVnaXN0ZXJlZCBmb3IgTEEgSGFja3MgdGhpcyBzdW1tZXIuIEkgZG9uJ3QgZXZlbiBrbm93IGhvdyBJIGVuZGVkIHVwIHRoZXJlIG9uIGEgRnJpZGF5IG5pZ2h0LCBidXQgd2hlbiBJIHNhdyB3aGF0IHdhcyBnb2luZyBvbiwgSSBncmFiYmVkIGEgY2hhaXIgYW5kIHN0YXJ0ZWQgaGFja2luZyBhd2F5LiBXb3JyaWVkIEkgaGFkIGp1c3Qgc251Y2sgaW4gdGhlIGJhY2sgZG9vciBhbmQgc3RhcnRlZCBjb21wZXRpbmcsIG15IHJpZGUgbGVmdCBhbmQgdGhlcmUgSSB3YXMsIGZvciB0aGUgbmV4dCB0d28gZGF5cy4gVGhhdCdzIHJpZ2h0LiBJIHNudWNrIGluIHRoZSBiYWNrIG9mIExBIEhhY2tzIGxhc3Qgc3VtbWVyIGF0IFVDTEEgYW5kIGhhY2tlZCB3aXRoIGtpZHMgMTAgeWVhcnMgeW91bmdlciB0aGFuIG1lLiBJIGNvdWxkbid0IG1pc3MgaXQuIEkgd2FzIGZsb29yZWQgd2hlbiBJIHNhdyBob3cgbWFueSBwZW9wbGUgd2VyZSBpbiBpdC4gTWUsIGJlaW5nIHRoZSBtaXNjaGV2aW91cyBoYWNrZXIgSSBhbSwgSSB0aG91Z2h0IGlmIEkgdXNlZCB0aGUgZW5lcmd5IG9mIHRoZSBlbnZpcm9ubWVudCB0byBteSBhZHZhbnRhZ2UsIEkgY291bGQgYnVpbGQgc29tZXRoaW5nIGNvb2wuIExvbmcgc3Rvcnkgc2hvcnQsIGxldCBtZSBqdXN0IHNheSwgdGhhdCBpZiB5b3UgaGF2ZSBiZWVuIGhhdmluZyBhIGhhcmQgdGltZSBsYXVuY2hpbmcsIHNpZ24gdXAgZm9yIGEgaGFja2F0aG9uLiBJdCdzIGEgZ3VhcmFudGVlZCB3YXkgdG8gb3Zlci1jb21wZW5zYXRlIGZvciB5b3VyIGNvbnN0YW50IGZhaWx1cmUgdG8gbGF1bmNoLiBNb3JlIG9uIHdoYXQgaGFwcGVuZWQgd2hlbiBJIHRvb2sgdGhlIHN0YWdlIGJ5IHN1cnByaXNlIGFuZCBnb3QgYm9vdGVkIGxhdGVyLi4uXCIgXG4gICAgfVxuICBdXG5cblxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnQWJvdXRDdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0FwcEN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnUmVzdW1lQ3RybCcsICgkc2NvcGUpIC0+XG4gICRzY29wZS5ibG9iID0gJzxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwibGFyZ2UtMTJcIj48ZGl2IGNsYXNzPVwicm93XCI+PGRpdiBjbGFzcz1cImxhcmdlLTEyIGNvbHVtbnNcIj48aDY+Tk9WIDIwMTMgLSBQUkVTRU5UPC9oNj48YnIvPjxoMj5IeWJyaWQgRXhwZXJpZW5jZSBEZXNpZ25lci9EZXZlbG9wZXIsIEluZGVwZW5kZW50PC9oMj48YnIvPjxwPldvcmtlZCB3aXRoIG5vdGVhYmxlIGVudHJlcHJlbm91cnMgb24gc2V2ZXJhbCBuZXcgcHJvZHVjdCBhbmQgYnVzaW5lc3MgbGF1bmNoZXMuIEhlbGQgbnVtZXJvdXMgcm9sZXMsIGluY2x1ZGluZyBjb250ZW50IHN0cmF0ZWdpc3QsIHVzZXIgcmVzZWFyY2hlciwgZGVzaWduZXIgYW5kIGRldmVsb3Blci4gPC9wPjxwPjxzdHJvbmc+Q29tcGFuaWVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cIm5vXCI+PGxpPjxhIGhyZWY9XCJodHRwOi8vdGFwY2VudGl2ZS5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5UYXBjZW50aXZlPC9hPjwvbGk+PGxpPjxhIGhyZWY9XCJodHRwOi8vY3BnLmlvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+Q1BHaW88L2E+PC9saT48bGk+PGEgaHJlZj1cImh0dHA6Ly9rb3UucG4vXCI+S291LnBuIE1lZGlhPC9hPjwvbGk+PGxpPiA8YSBocmVmPVwiaHR0cDovL21lZHljYXRpb24uY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+TWVkeWNhdGlvbjwvYT48L2xpPjxsaT4gPGEgaHJlZj1cImh0dHA6Ly93d3cuc3VudGltZXMuY29tL1wiIHRhcmdldD1cIl9ibGFua1wiPkNoaWNhZ28gU3VuIFRpbWVzPC9hPjwvbGk+PC91bD48YnIvPjxwPjxzdHJvbmc+VGFwY2VudGl2ZSBEZWxpdmVyYWJsZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5Db21wbGV0ZSBUYXBjZW50aXZlLmNvbSBtYXJrZXRpbmcgd2Vic2l0ZSBhbmQgVVggb3ZlcmhhdWwgb2YgY29yZSBwcm9kdWN0LCB0aGUgXCJUYXBjZW50aXZlIE1hbmFnZXJcIjwvbGk+PGxpPkluZHVzdHJpYWwgZGVzaWduIG9mIHRoZSBUYXBjZW50aXZlIFRvdWNocG9pbnQ8L2xpPjxsaT5Db250ZW50IHN0cmF0ZWd5IGZvciBjb3Jwb3JhdGUgbWFya2V0aW5nIHNpdGU8L2xpPjxsaT5Nb2JpbGUgZmlyc3QgbWFya2V0aW5nIHdlYnNpdGUgdXNpbmcgSW9uaWMgYW5kIEFuZ3VsYXI8L2xpPjwvdWw+PHA+PHN0cm9uZz5DUEdpbyBEZWxpdmVyYWJsZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5Qcm9kdWN0IGFuZCBidXNpbmVzcyBzdHJhdGVneSwgdGVjaG5pY2FsIGFyY2hpdGVjdHVyZSBhbmQgc3BlY2lmaWNhdGlvbiBkZXNpZ248L2xpPjxsaT5PbmUgaHVuZHJlZCBwYWdlIHByb3Bvc2FsIHRlbXBsYXRlIG9uIGJ1c2luZXNzIG1vZGVsIGFuZCBjb3Jwb3JhdGUgY2FwYWJpbGl0aWVzPC9saT48bGk+TWFya2V0aW5nIHdlYnNpdGUgZGVzaWduIGFuZCBjb250ZW50IHN0cmF0ZWd5PC9saT48bGk+Q29yZSBwcm9kdWN0IGRlc2lnbiBhbmQgTVZQIGZ1bmN0aW9uYWwgcHJvdG90eXBlPC9saT48L3VsPjxwPjxzdHJvbmc+S291LnBuIERlbGl2ZXJhYmxlczwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJidWxsZXRzXCI+PGxpPktvdS5wbiBNZWRpYSBicmFuZCByZWZyZXNoPC9saT48bGk+TWFya2V0aW5nIHNpdGUgcmVkZXNpZ248L2xpPjxsaT5Qb3J0YWwgdXNlciBleHBlcmllbmNlIG92ZXJoYXVsPC9saT48L3VsPjxwPjxzdHJvbmc+TWVkeWNhdGlvbiBEZWxpdmVyYWJsZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5Db25jZXB0dWFsIGRlc2lnbiBhbmQgYXJ0IGRpcmVjdGlvbjwvbGk+PGxpPlVzZXIgcmVzZWFyY2g8L2xpPjxsaT5SYXBpZCBwcm90b3R5cGVzPC9saT48L3VsPjxwPjxzdHJvbmc+Q2hpY2FnbyBTdW4gVGltZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5Db25jZXB0dWFsIGRlc2lnbiBhbmQgYXJ0IGRpcmVjdGlvbjwvbGk+PGxpPk5hdGl2ZSBpT1MgYW5kIEFuZHJvaWQgYXBwIGRlc2lnbiBhbmQganVuaW9yIGRldmVsb3BtZW50PC9saT48bGk+SHlicmlkIElvbmljL0FuZ3VsYXIgZGV2ZWxvcG1lbnQ8L2xpPjwvdWw+PC9kaXY+PC9kaXY+PGJyLz48ZGl2IGNsYXNzPVwicm93XCI+PGRpdiBjbGFzcz1cImxhcmdlLTEyIGNvbHVtbnNcIj48aDY+TUFSQ0ggMjAxMCAtIE9DVE9CRVIgMjAxMzwvaDY+PGJyLz48aDI+RGlyZWN0b3Igb2YgVXNlciBFeHBlcmllbmNlLCBMaWdodGJhbms8L2gyPjxici8+PHA+TGF1bmNoZWQgYW5kIHN1cHBvcnRlZCBtdWx0aXBsZSBuZXcgY29tcGFuaWVzIHdpdGhpbiB0aGUgTGlnaHRiYW5rIHBvcnRmb2xpby4gPC9wPjxwPjxzdHJvbmc+Q29tcGFuaWVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cIm5vXCI+PGxpPiA8YSBocmVmPVwiaHR0cDovL2NoaWNhZ29pZGVhcy5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5DaGljYWdvSWRlYXMuY29tPC9hPjwvbGk+PGxpPiA8YSBocmVmPVwiaHR0cDovL2JlbmNocHJlcC5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5CZW5jaFByZXAuY29tPC9hPjwvbGk+PGxpPiA8YSBocmVmPVwiaHR0cDovL3NuYXBzaGVldGFwcC5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5TbmFwU2hlZXRBcHAuY29tPC9hPjwvbGk+PGxpPk1vbnRobHlzLmNvbSAoZGVmdW5jdCk8L2xpPjxsaT4gPGEgaHJlZj1cImh0dHA6Ly9kb3VnaC5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5Eb3VnaC5jb208L2E+PC9saT48bGk+IDxhIGhyZWY9XCJodHRwOi8vZ3JvdXBvbi5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5Hcm91cG9uLmNvbTwvYT48L2xpPjwvdWw+PGJyLz48cD48c3Ryb25nPkNoaWNhZ28gSWRlYXMgRGVsaXZlcmFibGVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHNcIj48bGk+V2Vic2l0ZSBkZXNpZ24gcmVmcmVzaCwgYXJ0IGRpcmVjdGlvbjwvbGk+PGxpPkN1c3RvbSB0aWNrZXQgcHVyY2hhc2luZyBwbGF0Zm9ybSBVWCByZXNlYXJjaCAmYW1wOyBkZXNpZ248L2xpPjxsaT5SdWJ5IG9uIFJhaWxzIGRldmVsb3BtZW50LCBtYWludGVuZW5jZTwvbGk+PGxpPkdyYXBoaWMgZGVzaWduIHN1cHBvcnQ8L2xpPjxsaT5Bbm51YWwgcmVwb3J0IGRlc2lnbjwvbGk+PC91bD48cD48c3Ryb25nPkJlbmNoUHJlcC5jb20gRGVsaXZlcmFibGVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHNcIj48bGk+UmUtYnJhbmRpbmcsIGNvbXBsZXRlIEJlbmNoUHJlcCBpZGVudGl0eSBwYWNrYWdlPC9saT48bGk+U3VwcG9ydGVkIGNvbXBhbnkgd2l0aCBhbGwgZGVzaWduIGFuZCB1eCBmcm9tIHplcm8gdG8gZWlnaHQgbWlsbGlvbiBpbiBmaW5hbmNpbmc8L2xpPjxsaT5MZWFkIGFydCBhbmQgVVggZGlyZWN0aW9uIGZvciB0d28geWVhcnM8L2xpPjxsaT5Gcm9udC1lbmQgdXNpbmcgQmFja2JvbmUgYW5kIEJvb3RzdHJhcDwvbGk+PGxpPlVzZXIgcmVzZWFyY2gsIGV0aG5vZ3JhcGhpYyBzdHVkaWVzLCB1c2VyIHRlc3Rpbmc8L2xpPjxsaT5FbWFpbCBtYXJrZXRpbmcgY2FkZW5jZSBzeXN0ZW0gZGVzaWduIGFuZCBleGVjdXRpb248L2xpPjxsaT5TY3JpcHRlZCwgc3Rvcnlib2FyZGVkIGFuZCBleGVjdXRlZCBib3RoIGFuaW1hdGVkIGFuZCBsaXZlIG1vdGlvbiBleHBsYWluZXIgdmlkZW9zPC9saT48L3VsPjxwPjxzdHJvbmc+U25hcFNoZWV0QXBwLmNvbSBEZWxpdmVyYWJsZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5MYXJnZSBzY2FsZSBwb3J0YWwgVVggcmVzZWFyY2ggYW5kIGluZm9ybWF0aW9uIGFyY2hpdGVjdHVyZTwvbGk+PGxpPlRocmVlIHJvdW5kcyBvZiByYXBpZCBwcm90b3R5cGluZyBhbmQgdXNlciB0ZXN0aW5nPC9saT48bGk+R3JhcGhpYyBkZXNpZ24gYW5kIGludGVyYWN0aW9uIGRlc2lnbiBmcmFtZXdvcms8L2xpPjxsaT5Vc2VyIHRlc3Rpbmc8L2xpPjwvdWw+PHA+PHN0cm9uZz5Nb250aGx5cy5jb20gRGVsaXZlcmFibGVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHNcIj48bGk+SWRlbnRpdHkgYW5kIGFydCBkaXJlY3Rpb248L2xpPjxsaT5Qcm9kdWN0IHN0cmF0ZWd5IGFuZCBuZXcgY29tcGFueSBsYXVuY2g8L2xpPjxsaT5PbmxpbmUgbWFya2V0aW5nIHN0cmF0ZWd5LCBpbmNsdWRpbmcgdHJhbnNhY3Rpb25hbCBlbWFpbCwgcHJvbW90aW9uIGRlc2lnbiBhbmQgbGVhZCBnZW5lcmF0aW9uPC9saT48bGk+UHJvZHVjdCBleHBlcmllbmNlIGRlc2lnbiBhbmQgZnJvbnQtZW5kPC9saT48bGk+Q29udGVudCBzdHJhdGVneTwvbGk+PGxpPlNjcmlwdGVkLCBzdG9yeWJvYXJkZWQgYW5kIGV4ZWN1dGVkIGJvdGggYW5pbWF0ZWQgYW5kIGxpdmUgbW90aW9uIGV4cGxhaW5lciB2aWRlb3M8L2xpPjwvdWw+PHA+PHN0cm9uZz5Eb3VnaC5jb20gRGVsaXZlcmFibGVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHMgYnVsbGV0c1wiPjxsaT5Db25zdW1lciBqb3VybmV5IG1hcHBpbmcgYW5kIGV0aG5vZ3JhcGhpYyBzdHVkaWVzPC9saT48bGk+UmFwaWQgcHJvdG90eXBpbmcsIGNvbmNlcHR1YWwgZGVzaWduPC9saT48bGk+TWVzc2FnaW5nIHN0cmF0ZWd5LCB1c2VyIHRlc3Rpbmc8L2xpPjwvdWw+PHA+PHN0cm9uZz5Hcm91cG9uLmNvbSBEZWxpdmVyYWJsZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5FbWVyZ2luZyBtYXJrZXRzIHJlc2VhcmNoPC9saT48bGk+UmFwaWQgZGVzaWduIGFuZCBwcm90b3R5cGluZzwvbGk+PGxpPlZpc3VhbCBkZXNpZ24gb24gbmV3IGNvbmNlcHRzPC9saT48bGk+RW1haWwgc2VnbWVudGF0aW9uIHJlc2VhcmNoPC9saT48L3VsPjwvZGl2PjwvZGl2Pjxici8+PGRpdiBjbGFzcz1cInJvd1wiPjxkaXYgY2xhc3M9XCJsYXJnZS0xMiBjb2x1bW5zXCI+PGg2Pk5PVkVNQkVSIDIwMDcgLSBBUFJJTCAyMDEwPC9oNj48YnIvPjxoMj5EZXZlbG9wZXIgJmFtcDsgQ28tZm91bmRlciwgRGlsbHllby5jb208L2gyPjxici8+PHA+Q28tZm91bmRlZCwgZGVzaWduZWQgYW5kIGRldmVsb3BlZCBhIGRhaWx5IGRlYWwgZUNvbW1lcmNlIHdlYnNpdGUuPC9wPjxwPjxzdHJvbmc+Um9sZTwvc3Ryb25nPjxici8+RGVzaWduZWQsIGRldmVsb3BlZCBhbmQgbGF1bmNoZWQgY29tcGFuaWVzIGZpcnN0IGNhcnQgd2l0aCBQSFAuIEl0ZXJhdGVkIGFuZCBncmV3IHNpdGUgdG8gbW9yZSB0aGFuIHR3byBodW5kcmVkIGFuZCBmaWZ0eSB0aG91c2FuZCBzdWJzY3JpYmVycyBpbiBsZXNzIHRoYW4gb25lIHllYXIuIDwvcD48cD48c3Ryb25nPk5vdGVhYmxlIFN0YXRzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHNcIj48bGk+QnVpbHQgYSBsaXN0IG9mIDI1MCwwMDAgc3Vic2NyaWJlcnMgaW4gdGhlIGZpcnN0IHllYXI8L2xpPjxsaT5QaXZvdGVkIGFuZCB0d2Vha2VkIGRlc2lnbiwgYnVzaW5lc3MgYW5kIGFwcHJvYWNoIHRvIDEwMDAgdHJhbnNhY3Rpb25zIHBlciBkYWlseTwvbGk+PGxpPlNvbGQgYnVzaW5lc3MgaW4gRGVjZW1iZXIgMjAwOSB0byBJbm5vdmF0aXZlIENvbW1lcmNlIFNvbHV0aW9uczwvbGk+PC91bD48L2Rpdj48L2Rpdj48YnIvPjxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwibGFyZ2UtMTIgY29sdW1uc1wiPjxoNj5NQVJDSCAyMDA1IC0gT0NUT0JFUiAyMDA3PC9oNj48YnIvPjxoMj5Tb2x1dGlvbnMgQXJjaGl0ZWN0ICZhbXA7IFNlbmlvciBEZXZlbG9wZXIsIDxhIGhyZWY9XCJodHRwOi8vd3d3Lm1hbmlmZXN0ZGlnaXRhbC5jb20vXCI+TWFuaWZlc3QgRGlnaXRhbDwvYT48L2gyPjxici8+PHA+QnVpbHQgYW5kIG1hbmFnZWQgbXVsdGlwbGUgQ2FyZWVyQnVpbGRlci5jb20gbmljaGUgc2l0ZXMgZm9yIHRoZSBsYXJnZXN0IGluZGVwZW5kZW50IGFnZW5jeSBpbiB0aGUgbWlkd2VzdC48L3A+PHA+PHN0cm9uZz5Sb2xlPC9zdHJvbmc+PGJyLz5SZXNlYXJjaCBhbmQgZXhwbG9yZSBlbWVyZ2luZyB0ZWNobm9sb2dpZXMsIGltcGxlbWVudCBzb2x1dGlvbnMgYW5kIG1hbmFnZSBvdGhlciBkZXZlbG9wZXJzLiBXb3JrZWQgd2l0aCBhc3AubmV0IG9uIGEgZGFpbHkgYmFzaXMgZm9yIGFsbW9zdCB0d28geWVhcnMuIDwvcD48cD48c3Ryb25nPk5vdGVhYmxlIEFjY29tcGxpc2htZW50czwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJidWxsZXRzXCI+PGxpPlJlY29nbml6ZWQgZm9yIGxhdW5jaGluZyBoaWdoIHF1YWxpdHkgd2ViIGFwcCBmb3IgQ2FyZWVyIEJ1aWxkZXIgaW4gcmVjb3JkIHRpbWU8L2xpPjxsaT5NYW5hZ2VkIGV4dHJlbWUgU0VPIHByb2plY3Qgd2l0aCBtb3JlIHRoYW4gNTAwIHRob3VzYW5kIGxpbmtzLCBwYWdlcyBhbmQgb3ZlciA4IG1pbGxpb24gVUdDIGFydGlmYWN0czwvbGk+PGxpPlNoaWZ0ZWQgYWdlbmNpZXMgZGV2ZWxvcG1lbnQgcHJhY3RpY2VzIHRvIHZhcmlvdXMgbmV3IGNsaWVudC1jZW50cmljIEFKQVggbWV0aG9kb2xvZ2llczwvbGk+PGxpPk1hbmFnZWQgbXVsdGlwbGUgcHJvamVjdHMgY29uY3VycmVudGx5LCBpbmNsdWRpbmcgY2hvb3NlY2hpY2Fnby5jb20gYW5kIGJyaWVmaW5nLmNvbTwvbGk+PC91bD48L2Rpdj48L2Rpdj48YnIvPjxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwibGFyZ2UtMTIgY29sdW1uc1wiPjxoNj5BUFJJTCAyMDA0IC0gSkFOVUFSWSAyMDA3PC9oNj48YnIvPjxoMj5KdW5pb3IgUExEIERldmVsb3BlciwgIDxhIGhyZWY9XCJodHRwOi8vd3d3Lm1hbmlmZXN0ZGlnaXRhbC5jb20vXCI+QXZlbnVlPC9hPjwvaDI+PGJyLz48cD5Gcm9udC1lbmQgZGV2ZWxvcGVyIGFuZCBVWCBkZXNpZ24gaW50ZXJuIGZvciBBdmVudWUgQSBSYXpvcmZpc2hzXFwnIGxlZ2FjeSBjb21wYW55LCBBdmVudWUtaW5jLjwvcD48cD48c3Ryb25nPlJvbGU8L3N0cm9uZz48YnIvPkRldmVsb3AgZnJvbnQtZW5kIGZvciBtdWx0aXBsZSBjbGllbnQgd2Vic2l0ZXMsIGluY2x1ZGluZyBmbG9yLmNvbSwgYWNoaWV2ZW1lbnQub3JnLCBjYW55b25yYW5jaC5jb20gYW5kIHR1cmJvY2hlZi48L3A+PHA+PHN0cm9uZz5Ob3RlYWJsZSBBY2NvbXBsaXNobWVudHM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5FeGVjdXRlZCBmcm9udC1lbmQgcHJvamVjdHMgb24tdGltZSBhbmQgdW5kZXItYnVkZ2V0PC9saT48bGk+QXNzaWduZWQgVVggaW50ZXJuc2hpcCByb2xlLCByZWNvZ25pemVkIGJ5IGRlc2lnbiB0ZWFtIGFzIGEgeW91bmcgdGFsZW50PC9saT48bGk+V2lyZWZyYW1lZCBjdXN0b20gc2hvcHBpbmcgY2FydCBwbGF0Zm9ybSBmb3IgZmxvci5jb208L2xpPjxsaT5EZXZlbG9wZWQgaW50ZXJuYWwgU0VPIHByYWN0aWNlPC9saT48L3VsPjwvZGl2PjwvZGl2Pjxici8+PGRpdiBjbGFzcz1cInJvd1wiPjxkaXYgY2xhc3M9XCJsYXJnZS0xMiBjb2x1bW5zXCI+PGg2PkpVTFkgMjAwMCAtIEpBTlVBUlkgMjAwNDwvaDY+PGJyLz48aDI+ZUNvbW1lcmNlIERldmVsb3BlciwgQXRvdmE8L2gyPjxici8+PHA+R2VuZXJhbCB3ZWIgZGVzaWduZXIgYW5kIGRldmVsb3BlciBmb3IgZmFtaWx5IG93bmVkIHBhaW50IGRpc3RyaWJ1dGlvbiBidXNpbmVzcy4gPC9wPjxwPjxzdHJvbmc+Um9sZTwvc3Ryb25nPjxici8+QnVpbHQgc2V2ZXJhbCBzaG9wcGluZyBjYXJ0cyBpbiBjbGFzc2ljIEFTUCBhbmQgUEhQLiBHcmV3IGJ1c2luZXNzIHVzaW5nIG9ubGluZSBtYXJrZXRpbmcgc3RyYXRlZ2llcyB0byB0d28gbWlsbGlvbiBpbiByZXZlbnVlLiA8L3A+PHA+PHN0cm9uZz5Ob3RlYWJsZSBBY2NvbXBsaXNobWVudHM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5CZWNhbWUgZmlyc3QgY29tcGFueSB0byBzaGlwIHBhaW50cyBhbmQgY29hdGluZ3MgYWNyb3NzIHRoZSBVbml0ZWQgU3RhdGVzPC9saT48bGk+Rmlyc3QgZW1wbG95ZWUsIGRldmVsb3BlZCBjb21wYW55IHRvIDIrIG1pbGxpb24gaW4gcmV2ZW51ZSB3aXRoIE92ZXJ0dXJlLCBHb29nbGUgQWR3b3JkcyBhbmQgU0VPPC9saT48bGk+Q3JlYXRlZCwgbWFya2V0ZWQgYW5kIHN1YnNjcmliZWQgdm9jYXRpb25hbCBzY2hvb2wgZm9yIHNwZWNpYWx0eSBjb2F0aW5nczwvbGk+PGxpPldvcmtlZCB3aXRoIHRvcCBJdGFsaWFuIHBhaW50IG1hbnVmYWN0dXJlcnMgb3ZlcnNlYXMgdG8gYnVpbGQgZXhjbHVzaXZlIGRpc3RyaWJ1dGlvbiByaWdodHM8L2xpPjwvdWw+PC9kaXY+PC9kaXY+PGJyLz48ZGl2IGNsYXNzPVwicm93XCI+PGRpdiBjbGFzcz1cImxhcmdlLTEyIGNvbHVtbnNcIj48aDY+U0VQVEVNQkVSIDIwMDAgLSBNQVkgMjAwMjwvaDY+PGJyLz48aDI+RWR1Y2F0aW9uPC9oMj48YnIvPjxwPlNlbGYgZWR1Y2F0ZWQgZGVzaWduZXIvcHJvZ3JhbW1lciB3aXRoIHZvY2F0aW9uYWwgdHJhaW5pbmcuIDwvcD48cD48c3Ryb25nPkNlcnRpZmljYXRpb25zPC9zdHJvbmc+PGJyLz5pTkVUKywgQSsgQ2VydGlmaWNhdGlvbiA8L3A+PHA+PHN0cm9uZz5BcHByZW50aWNlc2hpcDwvc3Ryb25nPjxici8+WWVhciBsb25nIHBlcnNvbmFsIGFwcHJlbnRpY2VzaGlwIHdpdGggZmlyc3QgZW5naW5lZXIgYXQgQW1hem9uLmNvbTwvcD48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj48YnIvPjxici8+J1xuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSm9iVGFwY2VudGl2ZUN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSm9iVGFwY2VudGl2ZVR3b0N0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSm9iQ3BnaW9DdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0pvYk1lZHljYXRpb25DdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0pvYkNzdEN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSm9iS291cG5DdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0pvYk1lZHljYXRpb25DdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0pvYk1lZHljYXRpb25DdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0pvYlRyb3VuZEN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSm9iTW9udGhseXNPbmVDdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0pvYk1vbnRobHlzVHdvQ3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdKb2JCZW5jaHByZXBDdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0NvbnRhY3RDdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0RldmVsb3BlcnNDdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0RldmVsb3BlckNlbnRlckN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnRG9jc0N0cmwnLCAoJHNjb3BlLCBEb2NzKSAtPlxuICAkc2NvcGUuJHdhdGNoICgtPiBEb2NzLmxpc3QpLCAtPlxuICAgICRzY29wZS5kb2NzID0gRG9jcy5saXN0XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdEb2NDdHJsJywgKCRzY29wZSwgJHNjZSwgJHN0YXRlUGFyYW1zLCAkdGltZW91dCwgRG9jcykgLT5cbiAgJHNjb3BlLmluZGV4ID0gaWYgJHN0YXRlUGFyYW1zLnN0ZXAgdGhlbiAkc3RhdGVQYXJhbXMuc3RlcC0xIGVsc2UgMFxuXG4gICRzY29wZS4kd2F0Y2ggKC0+IERvY3MubGlzdCksIC0+XG4gICAgJHNjb3BlLmRvYyA9IERvY3MuZmluZCgkc3RhdGVQYXJhbXMucGVybWFsaW5rKVxuICAgIGlmICRzY29wZS5kb2NcbiAgICAgICRzY29wZS5zdGVwID0gJHNjb3BlLmRvYy5zdGVwc1skc2NvcGUuaW5kZXhdXG4gICAgICAkc2NvcGUuc3RlcC51cmwgPSAkc2NlLnRydXN0QXNSZXNvdXJjZVVybCgkc2NvcGUuc3RlcC51cmwpXG5cbiAgICAgIGlmICRzY29wZS5zdGVwLnR5cGUgPT0gJ2RpYWxvZydcbiAgICAgICAgJHNjb3BlLm1lc3NhZ2VJbmRleCA9IDBcbiAgICAgICAgJHNjb3BlLm1lc3NhZ2VzID0gW11cbiAgICAgICAgJHRpbWVvdXQoJHNjb3BlLm5leHRNZXNzYWdlLCAxMDAwKVxuXG4gICRzY29wZS5oYXNNb3JlU3RlcHMgPSAtPlxuICAgIGlmICRzY29wZS5zdGVwXG4gICAgICAkc2NvcGUuc3RlcC5pbmRleCA8ICRzY29wZS5kb2Muc3RlcHMubGVuZ3RoXG5cbkZyYW5jaGluby5kaXJlY3RpdmUgJ215U2xpZGVzaG93JywgLT5cbiAgcmVzdHJpY3Q6ICdBQydcbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycykgLT5cbiAgICBjb25maWcgPSBhbmd1bGFyLmV4dGVuZChcbiAgICAgIHNsaWRlczogJy5zbGlkZScsICBcbiAgICBzY29wZS4kZXZhbChhdHRycy5teVNsaWRlc2hvdykpXG4gICAgc2V0VGltZW91dCAoLT5cbiAgICAgICQoZWxlbWVudCkuY3ljbGUgLT5cbiAgICAgICAgZng6ICAgICAnZmFkZScsIFxuICAgICAgICBzcGVlZDogICdmYXN0JyxcbiAgICAgICAgbmV4dDogICAnI25leHQyJywgXG4gICAgICAgIHByZXY6ICAgJyNwcmV2MicsXG4gICAgICAgIGNhcHRpb246ICcjYWx0LWNhcHRpb24nLFxuICAgICAgICBjYXB0aW9uX3RlbXBsYXRlOiAne3tpbWFnZXMuYWx0fX0nLFxuICAgICAgICBwYXVzZV9vbl9ob3ZlcjogJ3RydWUnXG4gICAgICAgICAgXG4gICAgKSwgMFxuIiwiQVVUSDBfQ0xJRU5UX0lEID0gJ0ExMjZYV2RKWlk3MTV3M0I2eVZDZXZwUzh0WW1QSnJqJ1xuQVVUSDBfRE9NQUlOID0gJ2Zvb3Ricm9zLmF1dGgwLmNvbSdcbkFVVEgwX0NBTExCQUNLX1VSTCA9IGxvY2F0aW9uLmhyZWYiLCJ3aW5kb3cuRnJhbmNoaW5vID0gYW5ndWxhci5tb2R1bGUoJ3RhcC5jb250cm9sbGVycycsIFtdKVxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnTG9naW5DdHJsJywgKCRzY29wZSwgYXV0aCwgJHN0YXRlLCBzdG9yZSkgLT5cblxuICBkb0F1dGggPSAtPlxuICAgIGF1dGguc2lnbmluIHtcbiAgICAgIGNsb3NhYmxlOiBmYWxzZVxuICAgICAgYXV0aFBhcmFtczogc2NvcGU6ICdvcGVuaWQgb2ZmbGluZV9hY2Nlc3MnXG4gICAgfSwgKChwcm9maWxlLCBpZFRva2VuLCBhY2Nlc3NUb2tlbiwgc3RhdGUsIHJlZnJlc2hUb2tlbikgLT5cbiAgICAgIHN0b3JlLnNldCAncHJvZmlsZScsIHByb2ZpbGVcbiAgICAgIHN0b3JlLnNldCAndG9rZW4nLCBpZFRva2VuXG4gICAgICBzdG9yZS5zZXQgJ3JlZnJlc2hUb2tlbicsIHJlZnJlc2hUb2tlblxuICAgICAgJHN0YXRlLmdvICdhcHAuaG9tZSdcbiAgICAgIHJldHVyblxuICAgICksIChlcnJvcikgLT5cbiAgICAgIGNvbnNvbGUubG9nICdUaGVyZSB3YXMgYW4gZXJyb3IgbG9nZ2luZyBpbicsIGVycm9yXG4gICAgICByZXR1cm5cbiAgICByZXR1cm5cblxuICAkc2NvcGUuJG9uICckaW9uaWMucmVjb25uZWN0U2NvcGUnLCAtPlxuICAgIGRvQXV0aCgpXG4gICAgcmV0dXJuXG4gIGRvQXV0aCgpXG4gIHJldHVyblxuXG5cbkZyYW5jaGluby5jb250cm9sbGVyICdJbnRyb0N0cmwnLCAoJHNjb3BlLCAkc3RhdGUsICRpb25pY1NsaWRlQm94RGVsZWdhdGUpIC0+XG4gICRzY29wZS5zdGFydEFwcCA9IC0+XG4gICAgJHN0YXRlLmdvKCdhcHAucHJvZHVjdHMnKVxuXG4gICRzY29wZS5uZXh0ID0gLT5cbiAgICAkaW9uaWNTbGlkZUJveERlbGVnYXRlLm5leHQoKVxuXG4gICRzY29wZS5wcmV2aW91cyA9IC0+XG4gICAgJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZS5wcmV2aW91cygpXG5cblxuICAkc2NvcGUuc2xpZGVDaGFuZ2VkID0gKGluZGV4KSAtPlxuICAgICRzY29wZS5zbGlkZUluZGV4ID0gaW5kZXhcblxuICByZXR1cm5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0FwcEN0cmwnLCAoJHNjb3BlKSAtPlxuICAjIFdpdGggdGhlIG5ldyB2aWV3IGNhY2hpbmcgaW4gSW9uaWMsIENvbnRyb2xsZXJzIGFyZSBvbmx5IGNhbGxlZFxuICAjIHdoZW4gdGhleSBhcmUgcmVjcmVhdGVkIG9yIG9uIGFwcCBzdGFydCwgaW5zdGVhZCBvZiBldmVyeSBwYWdlIGNoYW5nZS5cbiAgIyBUbyBsaXN0ZW4gZm9yIHdoZW4gdGhpcyBwYWdlIGlzIGFjdGl2ZSAoZm9yIGV4YW1wbGUsIHRvIHJlZnJlc2ggZGF0YSksXG4gICMgbGlzdGVuIGZvciB0aGUgJGlvbmljVmlldy5lbnRlciBldmVudDpcbiAgIyRzY29wZS4kb24oJyRpb25pY1ZpZXcuZW50ZXInLCBmdW5jdGlvbihlKSB7XG4gICN9KTtcbiAgcmV0dXJuXG5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0Rhc2hDdHJsJywgKCRzY29wZSwgJGh0dHApIC0+XG5cbiAgJHNjb3BlLmNhbGxBcGkgPSAtPlxuICAgICMgSnVzdCBjYWxsIHRoZSBBUEkgYXMgeW91J2QgZG8gdXNpbmcgJGh0dHBcbiAgICAkaHR0cChcbiAgICAgIHVybDogJ2h0dHA6Ly9hdXRoMC1ub2RlanNhcGktc2FtcGxlLmhlcm9rdWFwcC5jb20vc2VjdXJlZC9waW5nJ1xuICAgICAgbWV0aG9kOiAnR0VUJykudGhlbiAoLT5cbiAgICAgIGFsZXJ0ICdXZSBnb3QgdGhlIHNlY3VyZWQgZGF0YSBzdWNjZXNzZnVsbHknXG4gICAgICByZXR1cm5cbiAgICApLCAtPlxuICAgICAgYWxlcnQgJ1BsZWFzZSBkb3dubG9hZCB0aGUgQVBJIHNlZWQgc28gdGhhdCB5b3UgY2FuIGNhbGwgaXQuJ1xuICAgICAgcmV0dXJuXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuXG5cbiMgLS0tXG4jIGdlbmVyYXRlZCBieSBqczJjb2ZmZWUgMi4wLjRcblxuIiwiYW5ndWxhci5tb2R1bGUoXCJ0YXAuZGlyZWN0aXZlc1wiLCBbXSlcbiAgLmRpcmVjdGl2ZSBcImRldmljZVwiLCAtPlxuICAgIHJlc3RyaWN0OiBcIkFcIlxuICAgIGxpbms6IC0+XG4gICAgICBkZXZpY2UuaW5pdCgpXG5cbiAgLnNlcnZpY2UgJ2NvcHknLCAoJHNjZSkgLT5cbiAgICBjb3B5ID1cbiAgICAgIGFib3V0OlxuICAgICAgICBoZWFkaW5nOiBcIldlJ3JlIDxzdHJvbmc+dGFwcGluZzwvc3Ryb25nPiBpbnRvIHRoZSBmdXR1cmVcIlxuICAgICAgICBzdWJfaGVhZGluZzogXCJUYXBjZW50aXZlIHdhcyBjcmVhdGVkIGJ5IGEgdGVhbSB0aGF0IGhhcyBsaXZlZCB0aGUgbW9iaWxlIGNvbW1lcmNlIHJldm9sdXRpb24gZnJvbSB0aGUgZWFybGllc3QgZGF5cyBvZiBtQ29tbWVyY2Ugd2l0aCBXQVAsIHRvIGxlYWRpbmcgdGhlIGNoYXJnZSBpbiBtb2JpbGUgcGF5bWVudHMgYW5kIHNlcnZpY2VzIHdpdGggTkZDIHdvcmxkd2lkZS5cIlxuICAgICAgICBjb3B5OiBcIjxwPkZvciB1cywgbW9iaWxlIGNvbW1lcmNlIGhhcyBhbHdheXMgYmVlbiBhYm91dCBtdWNoIG1vcmUgdGhhbiBwYXltZW50OiAgbWFya2V0aW5nLCBwcm9tb3Rpb25zLCBwcm9kdWN0IGNvbnRlbnQsIGFuZCBsb3lhbHR5LCBhbGwgY29tZSB0byBsaWZlIGluc2lkZSBhIG1vYmlsZSBwaG9uZS4gTW9iaWxlIGNvbW1lcmNlIHJlYWxseSBnZXRzIGludGVyZXN0aW5nIHdoZW4gaXQgYnJpZGdlcyB0aGUgZGlnaXRhbCBhbmQgcGh5c2ljYWwgd29ybGRzLjwvcD48cD5PdXIgZ29hbCBhdCBUYXBjZW50aXZlIGlzIHRvIGNyZWF0ZSBhIHN0YXRlLW9mLXRoZS1hcnQgbW9iaWxlIGVuZ2FnZW1lbnQgcGxhdGZvcm0gdGhhdCBlbmFibGVzIG1hcmtldGVycyBhbmQgZGV2ZWxvcGVycyB0byBjcmVhdGUgZW50aXJlbHkgbmV3IGN1c3RvbWVyIGV4cGVyaWVuY2VzIGluIHBoeXNpY2FsIGxvY2F0aW9ucyDigJMgYWxsIHdpdGggYSBtaW5pbXVtIGFtb3VudCBvZiB0ZWNobm9sb2d5IGRldmVsb3BtZW50LjwvcD48cD5XZSB0aGluayB5b3XigJlsbCBsaWtlIHdoYXQgd2XigJl2ZSBidWlsdCBzbyBmYXIuIEFuZCBqdXN0IGFzIG1vYmlsZSB0ZWNobm9sb2d5IGlzIGNvbnN0YW50bHkgZXZvbHZpbmcsIHNvIGlzIHRoZSBUYXBjZW50aXZlIHBsYXRmb3JtLiBHaXZlIGl0IGEgdGVzdCBkcml2ZSB0b2RheS48L3A+XCJcbiAgICAgIHRlYW06XG4gICAgICAgIGhlYWRpbmc6IFwiXCJcbiAgICAgICAgYmlvczpcbiAgICAgICAgICBkYXZlX3JvbGU6IFwiXCJcbiAgICAgICAgICBkYXZlX2NvcHk6IFwiXCJcbiAgICBcblxuXG4gICAgdHJ1c3RWYWx1ZXMgPSAodmFsdWVzKSAtPlxuICAgICAgXy5lYWNoIHZhbHVlcywgKHZhbCwga2V5KSAtPlxuICAgICAgICBzd2l0Y2ggdHlwZW9mKHZhbClcbiAgICAgICAgICB3aGVuICdzdHJpbmcnXG4gICAgICAgICAgICAkc2NlLnRydXN0QXNIdG1sKHZhbClcbiAgICAgICAgICB3aGVuICdvYmplY3QnXG4gICAgICAgICAgICB0cnVzdFZhbHVlcyh2YWwpXG5cbiAgICB0cnVzdFZhbHVlcyhjb3B5KVxuXG4gICAgY29weVxuIiwiaWYgZGV2aWNlLmRlc2t0b3AoKVxuXG5lbHNlIGlmIGRldmljZS5tb2JpbGUoKVxuXG5cdCQgPSBkb2N1bWVudCAjIHNob3J0Y3V0XG5cdGNzc0lkID0gJ215Q3NzJyAjIHlvdSBjb3VsZCBlbmNvZGUgdGhlIGNzcyBwYXRoIGl0c2VsZiB0byBnZW5lcmF0ZSBpZC4uXG5cdGlmICEkLmdldEVsZW1lbnRCeUlkKGNzc0lkKVxuXHQgICAgaGVhZCAgPSAkLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF1cblx0ICAgIGxpbmsgID0gJC5jcmVhdGVFbGVtZW50KCdsaW5rJylcblx0ICAgIGxpbmsuaWQgICA9IGNzc0lkXG5cdCAgICBsaW5rLnJlbCAgPSAnc3R5bGVzaGVldCdcblx0ICAgIGxpbmsudHlwZSA9ICd0ZXh0L2Nzcydcblx0ICAgIGxpbmsuaHJlZiA9ICcvY3NzL2lvbmljLmFwcC5taW4uY3NzJ1xuXHQgICAgbGluay5tZWRpYSA9ICdhbGwnXG5cdCAgICBoZWFkLmFwcGVuZENoaWxkKGxpbmspXG4iLCJ3aW5kb3cuRnJhbmNoaW5vID0gYW5ndWxhci5tb2R1bGUoJ3RhcC5wcm9kdWN0JywgW10pXG5cbkZyYW5jaGluby5mYWN0b3J5ICdQcm9kdWN0JywgKCRodHRwLCAkcm9vdFNjb3BlKSAtPlxuICB7IGFsbDogKHF1ZXJ5U3RyaW5nKSAtPlxuICAgICRodHRwLmdldCAkcm9vdFNjb3BlLnNlcnZlciArICcvcHJvZHVjdHMnLCBwYXJhbXM6IHF1ZXJ5U3RyaW5nXG4gfVxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnUHJvZHVjdExpc3RDdHJsJywgKCRzY29wZSwgJHJvb3RTY29wZSwgJGlvbmljU2Nyb2xsRGVsZWdhdGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsIFByb2R1Y3QpIC0+XG4gICRzY29wZS5wcm9kdWN0cyA9IFtdXG4gIHBhZ2VTaXplID0gMjBcbiAgcHJvZHVjdENvdW50ID0gMVxuICBwYWdlID0gMFxuXG4gICRzY29wZS5jbGVhclNlYXJjaCA9IC0+XG4gICAgJHNjb3BlLnNlYXJjaEtleSA9ICcnXG4gICAgJHNjb3BlLmxvYWREYXRhKClcbiAgICByZXR1cm5cblxuICAkcm9vdFNjb3BlLiRvbiAnc2VhcmNoS2V5Q2hhbmdlJywgKGV2ZW50LCBzZWFyY2hLZXkpIC0+XG4gICAgJHNjb3BlLnNlYXJjaEtleSA9IHNlYXJjaEtleVxuICAgICRzY29wZS5sb2FkRGF0YSgpXG4gICAgcmV0dXJuXG5cbiAgJHNjb3BlLmZvcm1hdEFsY29ob2xMZXZlbCA9ICh2YWwpIC0+XG4gICAgcGFyc2VGbG9hdCB2YWxcblxuICAkc2NvcGUubG9hZERhdGEgPSAtPlxuICAgIHBhZ2UgPSAxXG4gICAgcmFuZ2UgPSAxXG4gICAgUHJvZHVjdC5hbGwoXG4gICAgICBzZWFyY2g6ICRzY29wZS5zZWFyY2hLZXlcbiAgICAgIG1pbjogcmFuZ2VbMF1cbiAgICAgIG1heDogcmFuZ2VbMV1cbiAgICAgIHBhZ2U6IHBhZ2VcbiAgICAgIHBhZ2VTaXplOiBwYWdlU2l6ZSkuc3VjY2VzcyAocmVzdWx0KSAtPlxuICAgICAgJHNjb3BlLnByb2R1Y3RzID0gcmVzdWx0LnByb2R1Y3RzXG4gICAgICBwcm9kdWN0Q291bnQgPSByZXN1bHQudG90YWxcbiAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLiRnZXRCeUhhbmRsZSgnbXlTY3JvbGwnKS5nZXRTY3JvbGxWaWV3KCkuc2Nyb2xsVG8gMCwgMCwgdHJ1ZVxuICAgICAgJHNjb3BlLiRicm9hZGNhc3QgJ3Njcm9sbC5pbmZpbml0ZVNjcm9sbENvbXBsZXRlJ1xuICAgICAgcmV0dXJuXG4gICAgcmV0dXJuXG5cbiAgJHNjb3BlLmxvYWRNb3JlRGF0YSA9IC0+XG4gICAgcGFnZSsrXG4gICAgcmFuZ2UgPSAxXG4gICAgUHJvZHVjdC5hbGwoXG4gICAgICBzZWFyY2g6ICRzY29wZS5zZWFyY2hLZXlcbiAgICAgIG1pbjogcmFuZ2VbMF1cbiAgICAgIG1heDogcmFuZ2VbMV1cbiAgICAgIHBhZ2U6IHBhZ2VcbiAgICAgIHBhZ2VTaXplOiBwYWdlU2l6ZSkuc3VjY2VzcyAocmVzdWx0KSAtPlxuICAgICAgcHJvZHVjdENvdW50ID0gcmVzdWx0LnRvdGFsXG4gICAgICBBcnJheTo6cHVzaC5hcHBseSAkc2NvcGUucHJvZHVjdHMsIHJlc3VsdC5wcm9kdWN0c1xuICAgICAgJHNjb3BlLiRicm9hZGNhc3QgJ3Njcm9sbC5pbmZpbml0ZVNjcm9sbENvbXBsZXRlJ1xuICAgICAgcmV0dXJuXG4gICAgcmV0dXJuXG5cbiAgJHNjb3BlLmlzTW9yZURhdGEgPSAtPlxuICAgIHBhZ2UgPCBwcm9kdWN0Q291bnQgLyBwYWdlU2l6ZVxuXG4gIHJldHVyblxuXG5cbkZyYW5jaGluby5jb250cm9sbGVyICdQcm9kdWN0RGV0YWlsQ3RybCcsICgkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkc2NlLCBQcm9kdWN0LCAkaW9uaWNIaXN0b3J5KSAtPlxuICBcbiAgJHNjb3BlLm15R29CYWNrID0gLT5cbiAgICAkaW9uaWNIaXN0b3J5LmdvQmFjaygpXG4gICAgcmV0dXJuXG5cbiAgJHNjb3BlLnByb2R1Y3QgPVxuICAgIG5hbWU6ICRzdGF0ZVBhcmFtcy5uYW1lXG4gICAgYnJld2VyeTogJHN0YXRlUGFyYW1zLmJyZXdlcnlcbiAgICBhbGNvaG9sOiAkc3RhdGVQYXJhbXMuYWxjb2hvbFxuICAgIHZpZGVvOiAkc3RhdGVQYXJhbXMudmlkZW9cbiAgICB0YWdzOiAkc3RhdGVQYXJhbXMudGFnc1xuICAkc2NvcGUudGFncyA9ICRzY29wZS5wcm9kdWN0LnRhZ3Muc3BsaXQoJywgJylcblxuICAkc2NvcGUuc2V0U2VhcmNoS2V5ID0gKHNlYXJjaEtleSkgLT5cbiAgICAkcm9vdFNjb3BlLiRlbWl0ICdzZWFyY2hLZXlDaGFuZ2UnLCBzZWFyY2hLZXlcbiAgICAkc3RhdGUuZ28gJ3Byb2R1Y3RzJ1xuICAgIHJldHVyblxuXG4gICRzY29wZS5mb3JtYXRBbGNvaG9sTGV2ZWwgPSAodmFsKSAtPlxuICAgICcnICsgcGFyc2VGbG9hdCh2YWwpICsgJyUnXG5cbiAgJHNjb3BlLmZvcm1hdFlvdXR1YmVVcmwgPSAodmFsKSAtPlxuICAgICRzY29wZS5jdXJyZW50VXJsID0gJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLycgKyB2YWwgKyAnJ1xuICAgICRzY29wZS5iZXR0ZXJVcmwgPSAkc2NlLnRydXN0QXNSZXNvdXJjZVVybCgkc2NvcGUuY3VycmVudFVybClcbiAgICAkc2NvcGUuYmV0dGVyVXJsXG5cbiAgcmV0dXJuXG5cbiMgLS0tXG4jIGdlbmVyYXRlZCBieSBqczJjb2ZmZWUgMi4wLjQiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=