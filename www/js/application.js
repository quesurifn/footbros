if (device.desktop()) {
  window.Franchino = angular.module('Franchino', ['ngSanitize', 'ui.router', 'btford.socket-io', 'tap.controllers', 'tap.directives']);
} else {
  window.Franchino = angular.module("Franchino", ['ionic', 'btford.socket-io', 'tap.controllers', 'tap.directives', 'tap.product', 'auth0', 'angular-storage', 'angular-jwt']);
}

Franchino.run(function($ionicPlatform, $rootScope) {
  $rootScope.server = 'https://vapealcura.com';
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
  }).state('app.hub', {
    url: '/hub',
    views: {
      menuContent: {
        templateUrl: 'hub.html'
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
    sso: true,
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
  $httpProvider.interceptors.push(function() {
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
  authProvider.on("loginSuccess", function($location, $window, profilePromise, idToken, store, refreshToken) {
    return profilePromise.then(function(profile) {
      var lock, setKeys, storage;
      lock = new Auth0Lock('A126XWdJZY715w3B6yVCevpS8tYmPJrj', 'footbros.auth0.com');
      store.set('profile', profile);
      store.set('token', idToken);
      store.set('refreshToken', refreshToken);
      storage = new CrossStorageClient("https://vapealcura.com/#/hub");
      setKeys = function() {
        return storage.set("token", idToken);
      };
      storage.onConnect().then(setKeys);
      return $window.location.href = 'https://shop.vapealcura.com';
    });
  });
  authProvider.on("authenticated", function($location, error) {
    return $location.url('https://shop.vapealcura.com');
  });
  return authProvider.on("loginFailure", function($location, error) {});
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiLCJhdXRoMC12YXJpYWJsZXMuY29mZmVlIiwiY29udHJvbGxlcnMuY29mZmVlIiwiZGlyZWN0aXZlcy5jb2ZmZWUiLCJpbml0LmNvZmZlZSIsInByb2R1Y3QuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUcsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFIO0FBQ0UsRUFBQSxNQUFNLENBQUMsU0FBUCxHQUFtQixPQUFPLENBQUMsTUFBUixDQUFlLFdBQWYsRUFBNEIsQ0FBQyxZQUFELEVBQWUsV0FBZixFQUE0QixrQkFBNUIsRUFBZ0QsaUJBQWhELEVBQW1FLGdCQUFuRSxDQUE1QixDQUFuQixDQURGO0NBQUEsTUFBQTtBQUlFLEVBQUEsTUFBTSxDQUFDLFNBQVAsR0FBbUIsT0FBTyxDQUFDLE1BQVIsQ0FBZSxXQUFmLEVBQTRCLENBQUUsT0FBRixFQUM3QyxrQkFENkMsRUFFN0MsaUJBRjZDLEVBRzdDLGdCQUg2QyxFQUk3QyxhQUo2QyxFQUs3QyxPQUw2QyxFQU03QyxpQkFONkMsRUFPN0MsYUFQNkMsQ0FBNUIsQ0FBbkIsQ0FKRjtDQUFBOztBQUFBLFNBYVMsQ0FBQyxHQUFWLENBQWMsU0FBQyxjQUFELEVBQWlCLFVBQWpCLEdBQUE7QUFDWixFQUFBLFVBQVUsQ0FBQyxNQUFYLEdBQW9CLHdCQUFwQixDQUFBO0FBQUEsRUFDQSxjQUFjLENBQUMsS0FBZixDQUFxQixTQUFBLEdBQUE7QUFDakIsSUFBQSxJQUFHLE1BQU0sQ0FBQyxTQUFWO0FBQ0UsTUFBQSxTQUFTLENBQUMsWUFBVixDQUFBLENBQUEsQ0FERjtLQUFBO0FBSUEsSUFBQSxJQUFHLE1BQU0sQ0FBQyxPQUFQLElBQW1CLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQTdDO0FBQ0UsTUFBQSxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyx3QkFBekIsQ0FBa0QsSUFBbEQsQ0FBQSxDQURGO0tBSkE7QUFNQSxJQUFBLElBQUcsTUFB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RUFBb0MsU0FBcEMsQ0FBQSxDQUFBO0FBQUEsSUFDQSxNQUFNLENBQUMsRUFBUCxDQUFVLFVBQVYsQ0FEQSxDQURvQjtFQUFBLENBWnRCLENBQUE7QUFBQSxFQWlCQSxNQUFNLENBQUMsa0JBQVAsR0FBNEIsU0FBQyxHQUFELEdBQUE7V0FDMUIsRUFBQSxHQUFLLFVBQUEsQ0FBVyxHQUFYLENBQUwsR0FBdUIsSUFERztFQUFBLENBakI1QixDQUFBO0FBQUEsRUFvQkEsTUFBTSxDQUFDLGdCQUFQLEdBQTBCLFNBQUMsR0FBRCxHQUFBO0FBQ3hCLElBQUEsTUFBTSxDQUFDLFVBQVAsR0FBb0IsZ0NBQUEsR0FBbUMsR0FBbkMsR0FBeUMsRUFBN0QsQ0FBQTtBQUFBLElBQ0EsTUFBTSxDQUFDLFNBQVAsR0FBbUIsSUFBSSxDQUFDLGtCQUFMLENBQXdCLE1BQU0sQ0FBQyxVQUEvQixDQURuQixDQUFBO1dBRUEsTUFBTSxDQUFDLFVBSGlCO0VBQUEsQ0FwQjFCLENBRndDO0FBQUEsQ0FBMUMsQ0EvREEsQ0FBQSIsImZpbGUiOiJhcHBsaWNhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImlmIGRldmljZS5kZXNrdG9wKClcbiAgd2luZG93LkZyYW5jaGlubyA9IGFuZ3VsYXIubW9kdWxlKCdGcmFuY2hpbm8nLCBbJ25nU2FuaXRpemUnLCAndWkucm91dGVyJywgJ2J0Zm9yZC5zb2NrZXQtaW8nLCAndGFwLmNvbnRyb2xsZXJzJywgJ3RhcC5kaXJlY3RpdmVzJ10pXG5cbmVsc2VcbiAgd2luZG93LkZyYW5jaGlubyA9IGFuZ3VsYXIubW9kdWxlKFwiRnJhbmNoaW5vXCIsIFsgJ2lvbmljJyxcbiAgICAnYnRmb3JkLnNvY2tldC1pbycsXG4gICAgJ3RhcC5jb250cm9sbGVycycsXG4gICAgJ3RhcC5kaXJlY3RpdmVzJyxcbiAgICAndGFwLnByb2R1Y3QnLFxuICAgICdhdXRoMCcsXG4gICAgJ2FuZ3VsYXItc3RvcmFnZScsXG4gICAgJ2FuZ3VsYXItand0J10pXG5cbkZyYW5jaGluby5ydW4gKCRpb25pY1BsYXRmb3JtLCAkcm9vdFNjb3BlKSAtPlxuICAkcm9vdFNjb3BlLnNlcnZlciA9ICdodHRwczovL3ZhcGVhbGN1cmEuY29tJ1xuICAkaW9uaWNQbGF0Zm9ybS5yZWFkeSAtPlxuICAgICAgaWYgd2luZG93LlN0YXR1c0JhclxuICAgICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KClcbiAgICAgICMgSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgICAgIyBmb3IgZm9ybSBpbnB1dHMpXG4gICAgICBpZiB3aW5kb3cuY29yZG92YSBhbmQgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZFxuICAgICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyIHRydWVcbiAgICAgIGlmIHdpbmRvdy5TdGF0dXNCYXJcbiAgICAgICAgIyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICAgIFN0YXR1c0Jhci5zdHlsZURlZmF1bHQoKVxuICAgICAgcmV0dXJuXG4gICAgcmV0dXJuXG5cblxuRnJhbmNoaW5vLmNvbmZpZyAoJHNjZURlbGVnYXRlUHJvdmlkZXIpIC0+XG4gICRzY2VEZWxlZ2F0ZVByb3ZpZGVyLnJlc291cmNlVXJsV2hpdGVsaXN0IFtcbiAgICAgICdzZWxmJ1xuICAgICAgbmV3IFJlZ0V4cCgnXihodHRwW3NdPyk6Ly8od3szfS4pP3lvdXR1YmUuY29tLy4rJCcpXG4gICAgXVxuICByZXR1cm5cblxuXG5GcmFuY2hpbm8uY29uZmlnICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgJGh0dHBQcm92aWRlciwgYXV0aFByb3ZpZGVyLCBqd3RJbnRlcmNlcHRvclByb3ZpZGVyKSAtPlxuXG4gICRzdGF0ZVByb3ZpZGVyXG5cbiAgICAuc3RhdGUgJ2FwcCcsXG4gICAgICB1cmw6ICcnXG4gICAgICBhYnN0cmFjdDogdHJ1ZVxuICAgICAgY29udHJvbGxlcjogJ0FwcEN0cmwnXG4gICAgICB0ZW1wbGF0ZVVybDogJ21lbnUuaHRtbCdcblxuICAgIC5zdGF0ZSgnbG9naW4nLFxuICAgICAgdXJsOiAnL2xvZ2luJ1xuICAgICAgdGVtcGxhdGVVcmw6ICdsb2dpbi5odG1sJ1xuICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ3RybCcpXG5cbiAgICAuc3RhdGUoJ2FwcC5wcm9kdWN0cycsXG4gICAgICB1cmw6ICcvcHJvZHVjdHMnXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdwcm9kdWN0LWxpc3QuaHRtbCdcbiAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdExpc3RDdHJsJylcblxuICAgIC5zdGF0ZSAnYXBwLnByb2R1Y3QtZGV0YWlsJyxcbiAgICAgIHVybDogJy9wcm9kdWN0LzpuYW1lLzpicmV3ZXJ5LzphbGNvaG9sLzp0YWdzLzp2aWRlbydcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3Byb2R1Y3QtZGV0YWlsLmh0bWwnXG4gICAgICAgICAgY29udHJvbGxlcjogJ1Byb2R1Y3REZXRhaWxDdHJsJ1xuXG4gICAgLnN0YXRlICdhcHAuaW50cm8nLFxuICAgICAgdXJsOiAnL2ludHJvJyxcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnSW50cm9DdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnaW50cm8uaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmhvbWUnLFxuICAgICAgdXJsOiAnL2hvbWUnXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnaG9tZS5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuZG9jcycsXG4gICAgICB1cmw6ICcvZG9jcydcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnRG9jc0N0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdkb2NzL2luZGV4Lmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5hYm91dCcsXG4gICAgICB1cmw6ICcvYWJvdXQnXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0Fib3V0Q3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2Fib3V0Lmh0bWwnXG5cblxuICAgIC5zdGF0ZSAnYXBwLmJsb2cnLFxuICAgICAgdXJsOiAnL2Jsb2cnXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0Jsb2dDdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYmxvZy5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAucmVzdW1lJyxcbiAgICAgIHVybDogJy9yZXN1bWUnXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ1Jlc3VtZUN0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdyZXN1bWUuaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmNvbnRhY3QnLFxuICAgICAgdXJsOiAnL2NvbnRhY3QnXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0NvbnRhY3RDdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29udGFjdC5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuZG9jJyxcbiAgICAgIHVybDogJy9kb2NzLzpwZXJtYWxpbmsnXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0RvY0N0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdkb2NzL3Nob3cuaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLnN0ZXAnLFxuICAgICAgdXJsOiAnL2RvY3MvOnBlcm1hbGluay86c3RlcCdcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnRG9jQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2RvY3Mvc2hvdy5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuam9iLXRhcGNlbnRpdmUnLFxuICAgICAgdXJsOiAnL2pvYi10YXBjZW50aXZlJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdKb2JUYXBjZW50aXZlQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2pvYi10YXBjZW50aXZlLmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5qb2ItdGFwY2VudGl2ZS10d28nLFxuICAgICAgdXJsOiAnL2pvYi10YXBjZW50aXZlLXR3bydcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnSm9iVGFwY2VudGl2ZVR3b0N0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdqb2ItdGFwY2VudGl2ZS10d28uaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmpvYi1jcGdpbycsXG4gICAgICB1cmw6ICcvam9iLWNwZ2lvJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdKb2JDcGdpb0N0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdqb2ItY3BnaW8uaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmpvYi1tZWR5Y2F0aW9uJyxcbiAgICAgIHVybDogJy9qb2ItbWVkeWNhdGlvbidcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnSm9iTWVkeWNhdGlvbkN0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdqb2ItbWVkeWNhdGlvbi5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuam9iLWNzdCcsXG4gICAgICB1cmw6ICcvam9iLWNzdCdcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnSm9iQ3N0Q3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2pvYi1jc3QuaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmpvYi1rb3VwbicsXG4gICAgICB1cmw6ICcvam9iLWtvdXBuJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdKb2JLb3VwbkN0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdqb2Ita291cG4uaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmh1YicsXG4gICAgICB1cmw6ICcvaHViJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnaHViLmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5qb2ItdHJvdW5kJyxcbiAgICAgIHVybDogJy9qb2ItdHJvdW5kJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdKb2JUcm91bmRDdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnam9iLXRyb3VuZC5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuam9iLW1vbnRobHlzJyxcbiAgICAgIHVybDogJy9qb2ItbW9udGhseXMnXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0pvYk1vbnRobHlzQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2pvYi1tb250aGx5cy5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuam9iLW1vbnRobHlzLXR3bycsXG4gICAgICB1cmw6ICcvam9iLW1vbnRobHlzLXR3bydcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnSm9iTW9udGhseXNUd29DdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnam9iLW1vbnRobHlzLXR3by5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuam9iLWJlbmNocHJlcCcsXG4gICAgICB1cmw6ICcvam9iLWJlbmNocHJlcCdcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnSm9iQmVuY2hwcmVwQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2pvYi1iZW5jaHByZXAuaHRtbCdcblxuICAgICAgICAjIENvbmZpZ3VyZSBBdXRoMFxuICAgICAgYXV0aFByb3ZpZGVyLmluaXRcbiAgICAgICAgZG9tYWluOiBBVVRIMF9ET01BSU5cbiAgICAgICAgY2xpZW50SUQ6IEFVVEgwX0NMSUVOVF9JRFxuICAgICAgICBzc286IHRydWVcbiAgICAgICAgbG9naW5TdGF0ZTogJ3Byb2R1Y3RzJ1xuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSBcIi9wcm9kdWN0c1wiXG5cbiAgICBqd3RJbnRlcmNlcHRvclByb3ZpZGVyLnRva2VuR2V0dGVyID0gKHN0b3JlLCBqd3RIZWxwZXIsIGF1dGgpIC0+XG4gICAgICBpZFRva2VuID0gc3RvcmUuZ2V0KCd0b2tlbicpXG4gICAgICByZWZyZXNoVG9rZW4gPSBzdG9yZS5nZXQoJ3JlZnJlc2hUb2tlbicpXG4gICAgICBpZiAhaWRUb2tlbiBvciAhcmVmcmVzaFRva2VuXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICBpZiBqd3RIZWxwZXIuaXNUb2tlbkV4cGlyZWQoaWRUb2tlbilcbiAgICAgICAgYXV0aC5yZWZyZXNoSWRUb2tlbihyZWZyZXNoVG9rZW4pLnRoZW4gKGlkVG9rZW4pIC0+XG4gICAgICAgICAgc3RvcmUuc2V0ICd0b2tlbicsIGlkVG9rZW5cbiAgICAgICAgICBpZFRva2VuXG4gICAgICBlbHNlXG4gICAgICAgIGlkVG9rZW5cblxuICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCAnand0SW50ZXJjZXB0b3InXG4gICAgICByZXR1cm5cblxuICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2ggLT5cbiAgICAgICByZXF1ZXN0OiAoY29uZmlnKSAtPlxuICAgICAgICAgaWYgY29uZmlnLnVybC5tYXRjaCgvXFwuaHRtbCQvKSAmJiAhY29uZmlnLnVybC5tYXRjaCgvXnNoYXJlZFxcLy8pXG4gICAgICAgICAgIGlmIGRldmljZS50YWJsZXQoKVxuICAgICAgICAgICAgIHR5cGUgPSAndGFibGV0J1xuICAgICAgICAgICBlbHNlIGlmIGRldmljZS5tb2JpbGUoKVxuICAgICAgICAgICAgIHR5cGUgPSAnbW9iaWxlJ1xuICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgdHlwZSA9ICdkZXNrdG9wJ1xuXG4gICAgICAgICAgIGNvbmZpZy51cmwgPSBcIi8je3R5cGV9LyN7Y29uZmlnLnVybH1cIlxuXG4gICAgICAgICBjb25maWdcblxuICBhdXRoUHJvdmlkZXIub24gXCJsb2dpblN1Y2Nlc3NcIiwgKCRsb2NhdGlvbiwgJHdpbmRvdywgcHJvZmlsZVByb21pc2UsIGlkVG9rZW4sIHN0b3JlLCByZWZyZXNoVG9rZW4pIC0+XG4gICAgcHJvZmlsZVByb21pc2UudGhlbiAocHJvZmlsZSkgLT5cbiAgICAgIGxvY2sgPSBuZXcgQXV0aDBMb2NrKCdBMTI2WFdkSlpZNzE1dzNCNnlWQ2V2cFM4dFltUEpyaicsICdmb290YnJvcy5hdXRoMC5jb20nKTtcblxuICAgICAgc3RvcmUuc2V0ICdwcm9maWxlJywgcHJvZmlsZVxuICAgICAgc3RvcmUuc2V0ICd0b2tlbicsIGlkVG9rZW5cbiAgICAgIHN0b3JlLnNldCAncmVmcmVzaFRva2VuJywgcmVmcmVzaFRva2VuXG5cbiAgICAgIHN0b3JhZ2UgPSBuZXcgQ3Jvc3NTdG9yYWdlQ2xpZW50KFwiaHR0cHM6Ly92YXBlYWxjdXJhLmNvbS8jL2h1YlwiKVxuXG4gICAgICBzZXRLZXlzID0gLT5cbiAgICAgICAgc3RvcmFnZS5zZXQgXCJ0b2tlblwiLCBpZFRva2VuXG5cbiAgICAgIHN0b3JhZ2Uub25Db25uZWN0KCkudGhlbihzZXRLZXlzKVxuICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ2h0dHBzOi8vc2hvcC52YXBlYWxjdXJhLmNvbSdcblxuICBhdXRoUHJvdmlkZXIub24gXCJhdXRoZW50aWNhdGVkXCIsICgkbG9jYXRpb24sIGVycm9yKSAtPlxuICAgICRsb2NhdGlvbi51cmwgJ2h0dHBzOi8vc2hvcC52YXBlYWxjdXJhLmNvbSdcblxuXG4gIGF1dGhQcm92aWRlci5vbiBcImxvZ2luRmFpbHVyZVwiLCAoJGxvY2F0aW9uLCBlcnJvcikgLT5cblxuXG5GcmFuY2hpbm8ucnVuICgkcm9vdFNjb3BlLCBhdXRoLCBzdG9yZSkgLT5cbiAgJHJvb3RTY29wZS4kb24gJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgLT5cbiAgICBpZiAhYXV0aC5pc0F1dGhlbnRpY2F0ZWRcbiAgICAgIHRva2VuID0gc3RvcmUuZ2V0KCd0b2tlbicpXG4gICAgICBpZiB0b2tlblxuICAgICAgICBhdXRoLmF1dGhlbnRpY2F0ZSBzdG9yZS5nZXQoJ3Byb2ZpbGUnKSwgdG9rZW5cbiAgICByZXR1cm5cbiAgcmV0dXJuXG5cblxuRnJhbmNoaW5vLnJ1biAoJHN0YXRlKSAtPlxuICAkc3RhdGUuZ28oJ2FwcC5ob21lJylcblxuRnJhbmNoaW5vLnJ1biAoJHJvb3RTY29wZSwgY29weSkgLT5cbiAgJHJvb3RTY29wZS5jb3B5ID0gY29weVxuXG5GcmFuY2hpbm8uZmFjdG9yeSAnU29ja2V0JywgKHNvY2tldEZhY3RvcnkpIC0+XG4gIHNvY2tldEZhY3RvcnkoKVxuXG5GcmFuY2hpbm8uZmFjdG9yeSAnRG9jcycsIChTb2NrZXQpIC0+XG4gIHNlcnZpY2UgPVxuICAgIGxpc3Q6IFtdXG4gICAgZmluZDogKHBlcm1hbGluaykgLT5cbiAgICAgIF8uZmluZCBzZXJ2aWNlLmxpc3QsIChkb2MpIC0+XG4gICAgICAgIGRvYy5wZXJtYWxpbmsgPT0gcGVybWFsaW5rXG5cbiAgU29ja2V0Lm9uICdkb2NzJywgKGRvY3MpIC0+XG4gICAgc2VydmljZS5saXN0ID0gZG9jc1xuXG4gIHNlcnZpY2VcblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0hvbWVDdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0NvbnRhY3RTaGVldEN0cmwnLCAoJHNjb3BlLCAkaW9uaWNBY3Rpb25TaGVldCkgLT5cbiAgJHNjb3BlLnNob3dBY3Rpb25zaGVldCA9IC0+XG4gICAgJGlvbmljQWN0aW9uU2hlZXQuc2hvd1xuICAgICAgdGl0bGVUZXh0OiBcIkNvbnRhY3QgRnJhbmNoaW5vXCJcbiAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6IFwiR2l0aHViIDxpIGNsYXNzPVxcXCJpY29uIGlvbi1zaGFyZVxcXCI+PC9pPlwiXG4gICAgICAgIH1cbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6IFwiRW1haWwgTWUgPGkgY2xhc3M9XFxcImljb24gaW9uLWVtYWlsXFxcIj48L2k+XCJcbiAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCJUd2l0dGVyIDxpIGNsYXNzPVxcXCJpY29uIGlvbi1zb2NpYWwtdHdpdHRlclxcXCI+PC9pPlwiXG4gICAgICAgIH1cbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6IFwiMjI0LTI0MS05MTg5IDxpIGNsYXNzPVxcXCJpY29uIGlvbi1pb3MtdGVsZXBob25lXFxcIj48L2k+XCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgICAgY2FuY2VsVGV4dDogXCJDYW5jZWxcIlxuICAgICAgY2FuY2VsOiAtPlxuICAgICAgICBjb25zb2xlLmxvZyBcIkNBTkNFTExFRFwiXG4gICAgICAgIHJldHVyblxuXG4gICAgICBidXR0b25DbGlja2VkOiAoaW5kZXgpIC0+XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIyMjQtMjQxLTkxODlcIiAgaWYgaW5kZXggaXMgMlxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiaHR0cDovL3R3aXR0ZXIuY29tL2ZyYW5jaGlub19jaGVcIiAgaWYgaW5kZXggaXMgMlxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwibWFpbHRvOmZyYW5jaGluby5ub25jZUBnbWFpbC5jb21cIiAgaWYgaW5kZXggaXMgMVxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiaHR0cDovL2dpdGh1Yi5jb20vZnJhbmd1Y2NcIiAgaWYgaW5kZXggaXMgMFxuICAgICAgICB0cnVlXG5cbiAgcmV0dXJuXG5GcmFuY2hpbm8uY29udHJvbGxlciBcIlNsaWRlc1RhcE9uZUN0cmxcIiwgKCRzY29wZSkgLT5cbiAgJHNjb3BlLmRhdGUgPSAnTk9WRU1CRVIgMjAxNCdcbiAgJHNjb3BlLnRpdGxlID0gJ1RhcGNlbnRpdmUgbWFuYWdlciBVWCBvdmVyaGF1bCBhbmQgZnJvbnQtZW5kJ1xuICAkc2NvcGUuaW1hZ2VzID0gW1xuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlRhcGNlbnRpdmUuY29tIFVYIG92ZXJoYXVsIGFuZCBTUEEgZnJvbnQtZW5kXCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2dpZi9yZXBvcnQuZ2lmXCIsXG4gICAgICBcInRleHRcIiA6IFwiPHA+U3R1ZHkgdGhlIHVzZXIgYW5kIHRoZWlyIGdvYWxzIGFuZCBvdmVyaGF1bCB0aGUgZXhwZXJpZW5jZSB3aGlsZSByZS13cml0aW5nIHRoZSBmcm9udC1lbmQgaW4gQW5ndWxhci48L3A+PGEgaHJlZj0naHR0cDovL3RhcGNlbnRpdmUuY29tJyB0YXJnZXQ9J19ibGFuayc+VmlzaXQgV2Vic2l0ZTwvYT5cIlxuICAgIH1cbiAgXVxuXG5GcmFuY2hpbm8uY29udHJvbGxlciBcIlNsaWRlc1RhcFR3b0N0cmxcIiwgKCRzY29wZSkgLT5cbiAgJHNjb3BlLmRhdGUgPSAnT0NUT0JFUiAyMDE0J1xuICAkc2NvcGUudGl0bGUgPSAnRGVza3RvcCBhbmQgbW9iaWxlIHdlYiBmcmllbmRseSBtYXJrZXRpbmcgd2Vic2l0ZSdcbiAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby10YXBjZW50aXZlLXllbGxvdy5qcGdcIixcbiAgICAgIFwidGV4dFwiIDogXCI8cD5DcmVhdGUgYSBrbm9ja291dCBicmFuZCBzdHJhdGVneSB3aXRoIGFuIGF3ZXNvbWUgbG9vayBhbmQgZmVlbC4gTWFrZSBhIHNvcGhpc3RpY2F0ZWQgb2ZmZXJpbmcgbG9vayBzaW1wbGUgYW5kIGVhc3kgdG8gdXNlLjwvcD48YSBocmVmPSdodHRwOi8vdGFwY2VudGl2ZS5jb20nIHRhcmdldD0nX2JsYW5rJz5WaXNpdCBXZWJzaXRlPC9hPlwiXG4gICAgfVxuXG4gIF1cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgXCJTbGlkZXNDcGdDdHJsXCIsICgkc2NvcGUpIC0+XG4gICRzY29wZS5kYXRlID0gJ0pVTFkgMjAxNCdcbiAgJHNjb3BlLnRpdGxlID0gJ0lkZW50aXR5LCBmdWxsLXN0YWNrIE1WUCwgYW5kIG1hcmtldGluZyB3ZWJzaXRlIGZvciBhIG5ldyBDUEcgZURpc3RyaWJ1dGlvbiBjb21wYW55J1xuICAkc2NvcGUuaW1hZ2VzID0gW1xuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNpbm9fY3BnaW8uanBnXCIsXG4gICAgICBcInRleHRcIiA6IFwiPHA+VHVybiBhbiBvbGQgc2Nob29sIENQRyBidXNpbmVzcyBpbnRvIGEgc29waGlzdGljYXRlZCB0ZWNobm9sb2d5IGNvbXBhbnkuIERlc2lnbiBzZWN1cmUsIGF1dG9tYXRlZCBhbmQgdHJhbnNmb3JtYXRpdmUgcGxhdGZvcm0sIHRlY2huaWNhbCBhcmNoaXRlY3R1cmUgYW5kIGV4ZWN1dGUgYW4gTVZQIGVub3VnaCB0byBhcXVpcmUgZmlyc3QgY3VzdG9tZXJzLiBNaXNzaW9uIGFjY29tcGxpc2hlZC48L3A+PGEgaHJlZj0naHR0cDovL2NwZy5pbycgdGFyZ2V0PSdfYmxhbmsnPlZpc2l0IFdlYnNpdGU8L2E+XCJcbiAgICB9XG4gIF1cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgXCJTbGlkZXNNZWR5Y2F0aW9uQ3RybFwiLCAoJHNjb3BlKSAtPlxuICAkc2NvcGUuZGF0ZSA9ICdBUFJJTCAyMDE0J1xuICAkc2NvcGUudGl0bGUgPSAnVXNlciBleHBlcmllbmNlIGRlc2lnbiBhbmQgcmFwaWQgcHJvdG90eXBpbmcgZm9yIE1lZHljYXRpb24sIGEgbmV3IGhlYWx0aGNhcmUgcHJpY2UgY29tcGFyaXNvbiB3ZWJzaXRlJ1xuICAkc2NvcGUuaW1hZ2VzID0gW1xuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLW1lZHljYXRpb24uanBnXCIsXG4gICAgICBcInRleHRcIiA6IFwiPHA+V2FsdHogdXAgaW4gdGhlIG9ubGluZSBoZWFsdGhjYXJlIGluZHVzdHJ5IGd1bnMgYmxhemluZyB3aXRoIGtpbGxlciBkZXNpZ24gYW5kIGluc3RpbmN0cy4gR2V0IHRoaXMgbmV3IGNvbXBhbnkgb2ZmIHRoZSBncm91bmQgd2l0aCBpdCdzIE1WUC4gU3dpcGUgZm9yIG1vcmUgdmlld3MuPC9wPjxhIGhyZWY9J2h0dHA6Ly9tZWR5Y2F0aW9uLmNvbScgdGFyZ2V0PSdfYmxhbmsnPlZpc2l0IFdlYnNpdGU8L2E+XCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLW1lZHljYXRpb24yLmpwZ1wiLFxuICAgICAgXCJ0ZXh0XCIgOiBcIlwiXG4gICAgfSxcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1tZWR5Y2F0aW9uMy5qcGdcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm8tbWVkeWNhdGlvbjQuanBnXCJcbiAgICB9LFxuICBdXG5cbkZyYW5jaGluby5jb250cm9sbGVyIFwiU2xpZGVzQ1NUQ3RybFwiLCAoJHNjb3BlKSAtPlxuICAkc2NvcGUuZGF0ZSA9ICdBUFJJTCAyMDE0J1xuICAkc2NvcGUudGl0bGUgPSAnRGVzaWduZWQgYW5kIGRldmVsb3BlZCBhIG5ldyB2ZXJzaW9uIG9mIHRoZSBDaGljYWdvIFN1biBUaW1lcyB1c2luZyBhIGh5YnJpZCBJb25pYy9Bbmd1bGFyIHN0YWNrJ1xuICAkc2NvcGUuaW1hZ2VzID0gW1xuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLWNzdC5qcGdcIixcbiAgICAgIFwidGV4dFwiIDogXCI8cD5IZWxwIHRoZSBzdHJ1Z2dsaW5nIG1lZGlhIGdpYW50IHVwZ3JhZGUgdGhlaXIgY29uc3VtZXIgZmFjaW5nIHRlY2hub2xvZ3kuIENyZWF0ZSBvbmUgY29kZSBiYXNlIGluIEFuZ3VsYXIgY2FwYWJsZSBvZiBnZW5lcmF0aW5nIGtpY2stYXNzIGV4cGVyaWVuY2VzIGZvciBtb2JpbGUsIHRhYmxldCwgd2ViIGFuZCBUVi5cIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm8tY3N0Mi5qcGdcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm8tY3N0My5qcGdcIlxuICAgIH0sXG4gIF1cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgXCJTbGlkZXNLb3VwbkN0cmxcIiwgKCRzY29wZSkgLT5cbiAgJHNjb3BlLmRhdGUgPSAnTUFSQ0ggMjAxNCdcbiAgJHNjb3BlLnRpdGxlID0gJ0JyYW5kIHJlZnJlc2gsIG1hcmtldGluZyBzaXRlIGFuZCBwbGF0Zm9ybSBleHBlcmllbmNlIG92ZXJoYXVsJ1xuICAkc2NvcGUuaW1hZ2VzID0gW1xuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLWtvdXBuMS5qcGdcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm8ta291cG4yLmpwZ1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1rb3Vwbi5qcGdcIlxuICAgIH0sXG4gIF1cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgXCJTbGlkZXNUcm91bmRDdHJsXCIsICgkc2NvcGUpIC0+XG4gICRzY29wZS5kYXRlID0gJ0FVR1VTVCAyMDEzJ1xuICAkc2NvcGUudGl0bGUgPSAnU29jaWFsIHRyYXZlbCBtb2JpbGUgYXBwIGRlc2lnbiwgVVggYW5kIHJhcGlkIHByb3RvdHlwaW5nJ1xuICAkc2NvcGUuaW1hZ2VzID0gW1xuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNpbm9fdHJvdW5kLmpwZ1wiLFxuICAgICAgXCJ0ZXh0XCIgOiBcIkRlc2lnbiBhbiBJbnN0YWdyYW0gYmFzZWQgc29jaWFsIHRyYXZlbCBhcHAuIFdoeT8gSSBkb24ndCBrbm93LlwiXG4gICAgfVxuICBdXG5cbkZyYW5jaGluby5jb250cm9sbGVyIFwiU2xpZGVzTW9udGhseXNDdHJsXCIsICgkc2NvcGUpIC0+XG4gICRzY29wZS5kYXRlID0gJ0ZFQlJVQVJZIDIwMTMnXG4gICRzY29wZS50aXRsZSA9ICdDdXN0b21lciBwb3J0YWwgcGxhdGZvcm0gVVggZGVzaWduIGFuZCBmcm9udC1lbmQnXG4gICRzY29wZS5pbWFnZXMgPSBbXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm8tbW9udGhseXMtYml6Mi5qcGdcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm9fbW9udGhseXMuanBnXCJcbiAgICB9XG4gIF1cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgXCJTbGlkZXNNb250aGx5c1R3b0N0cmxcIiwgKCRzY29wZSkgLT5cbiAgJHNjb3BlLmRhdGUgPSAnTUFSQ0ggMjAxMidcbiAgJHNjb3BlLnRpdGxlID0gJ0VudHJlcHJlbmV1ciBpbiByZXNpZGVuY2UgYXQgTGlnaHRiYW5rJ1xuICAkc2NvcGUuaW1hZ2VzID0gW1xuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLW1vbnRobHlzNy5qcGdcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm8tbW9udGhseXM1LmpwZ1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1tb250aGx5czIuanBnXCJcbiAgICB9XG4gIF1cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgXCJCbG9nQ3RybFwiLCAoJHNjb3BlKSAtPlxuXG4gICRzY29wZS5hcnRpY2xlcyA9IFtcbiAgICB7XG4gICAgICBcImRhdGVcIiA6IFwiUG9zdGVkIGJ5IEZyYW5jaGlubyBvbiBEZWNlbWJlciAxMiwgMjAxNFwiLFxuICAgICAgXCJoZWFkaW5nXCIgOiBcIk15IHBhdGggdG8gbGVhcm5pbmcgU3dpZnRcIixcbiAgICAgIFwiYXV0aG9yaW1nXCIgOiBcIi9pbWcvZnJhbmsucG5nXCIsXG4gICAgICBcImltZ1wiIDogXCIvaW1nL2RlYy9uZXdzbGV0dGVyLXN3aWZ0cmlzLWhlYWRlci5naWZcIixcbiAgICAgIFwiYmxvYlwiIDogXCJJJ3ZlIGJlZW4gYW4gTVZDIGRldmVsb3BlciBpbiBldmVyeSBsYW5ndWFnZSBleGNlcHQgZm9yIGlPUy4gVGhpcyBwYXN0IE9jdG9iZXIsIEkgdG9vayBteSBmaXJzdCByZWFsIGRlZXAgZGl2ZSBpbnRvIGlPUyBwcm9ncmFtbWluZyBhbmQgc3RhcnRlZCB3aXRoIFN3aWZ0LiBUaGVyZSBhcmUgdHdvIGdyZWF0IHR1dG9yaWFscyBvdXQgdGhlcmUuIFRoZSBmaXJzdCBpcyBmcm9tIGJsb2MuaW8gYW5kIGlzIGZyZWUuIEl0J3MgYSBnYW1lLCBTd2lmdHJpcywgc28gZ2V0IHJlYWR5IGZvciBzb21lIGFjdGlvbi4gVGhlIHNlY29uZCB3aWxsIGhlbHAgeW91IGJ1aWxkIHNvbWV0aGluZyBtb3JlIGFwcGlzaCwgaXQncyBieSBBcHBjb2RhLiBHb3QgdGhlaXIgYm9vayBhbmQgd2lsbCBiZSBkb25lIHdpdGggaXQgdGhpcyB3ZWVrLiBTbyBmYXIsIGJvb2tzIG9rLCBidXQgaXQgbW92ZXMgcmVhbGx5IHNsb3cuXCIsXG4gICAgICBcInJlc291cmNlMVwiIDogXCJodHRwczovL3d3dy5ibG9jLmlvL3N3aWZ0cmlzLWJ1aWxkLXlvdXItZmlyc3QtaW9zLWdhbWUtd2l0aC1zd2lmdFwiLFxuICAgICAgXCJyZXNvdXJjZTJcIiA6IFwiaHR0cDovL3d3dy5hcHBjb2RhLmNvbS9zd2lmdC9cIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJkYXRlXCIgOiBcIlBvc3RlZCBieSBGcmFuY2hpbm8gb24gRGVjZW1iZXIgMTEsIDIwMTRcIixcbiAgICAgIFwiaGVhZGluZ1wiIDogXCJXaHkgSSBnZXQgZ29vc2UgYnVtcHMgd2hlbiB5b3UgdGFsayBhYm91dCBhdXRvbWF0ZWQgZW1haWwgbWFya2V0aW5nIGFuZCBzZWdtZW50YXRpb24gYW5kIGN1c3RvbWVyLmlvIGFuZCB0aGluZ3MgbGlrZSB0aGF0LlwiLFxuICAgICAgXCJhdXRob3JpbWdcIiA6IFwiL2ltZy9mcmFuay5wbmdcIixcbiAgICAgIFwiaW1nXCIgOiBcIi9pbWcvZGVjL3ByZXBlbWFpbHMucG5nXCIsXG4gICAgICBcImJsb2JcIiA6IFwiSSBnZXQgdGVhcnkgZXllZCB3aGVuIEkgdGFsayBhYm91dCBteSB3b3JrIGF0IEJlbmNoUHJlcC5jb20uIEluIHNob3J0LCBJIHdhcyB0aGUgZmlyc3QgZW1wbG95ZWUgYW5kIGhlbHBlZCB0aGUgY29tcGFueSBnZXQgdG8gdGhlaXIgc2VyaWVzIEIgbmVhciB0aGUgZW5kIG9mIHllYXIgdHdvLiBJIGdvdCBhIGxvdCBkb25lIHRoZXJlLCBhbmQgb25lIG9mIHRoZSB0aGluZ3MgSSByZWFsbHkgZW5qb3llZCB3YXMgYnVpbGRpbmcgb3V0IHRlY2hub2xvZ3kgdG8gc2VnbWVudCBsZWFkcywgYnJpbmcgZGlmZmVyZW50IHVzZXJzIGRvd24gZGlmZmVyZW50IGNvbW11bmljYXRpb24gcGF0aHMgYW5kIGhvdyBJIG1hcHBlZCBvdXQgdGhlIGVudGlyZSBzeXN0ZW0gdXNpbmcgY29tcGxleCBkaWFncmFtcyBhbmQgd29ya2Zsb3dzLiBTb21lIG9mIHRoZSB0b29scyB3ZXJlIGJ1aWx0IGFuZCBiYXNlZCBvbiBxdWVzIGxpa2UgUmVkaXMgb3IgUmVzcXVlLCBvdGhlcnMgd2UgYnVpbHQgaW50byBFeGFjdFRhcmdldCBhbmQgQ3VzdG9tZXIuaW8uIEluIHRoZSBlbmQsIEkgYmVjYW1lIHNvbWV3aGF0IG9mIGFuIGV4cGVydCBhdCBtb25ldGl6aW5nIGVtYWlscy4gV2l0aGluIG91ciBlbWFpbCBtYXJrZXRpbmcgY2hhbm5lbCwgd2UgZXhwbG9yZWQgdGFnZ2luZyB1c2VycyBiYXNlZCBvbiB0aGVpciBhY3Rpb25zLCBzdWNoIGFzIG9wZW5zIG9yIG5vbiBvcGVucywgb3Igd2hhdCB0aGV5IGNsaWNrZWQgb24sIHdlIHRhcmdlZCBlbWFpbCB1c2VycyB3aG8gaGFkIGJlZW4gdG91Y2hlZCBzZXZlbiB0aW1lcyB3aXRoIHNwZWNpYWwgaXJyaXNpdGFibGUgc2FsZXMsIGJlY2F1c2Ugd2Uga25vdyBhZnRlciA2IHRvdWNoZXMsIHdlIGNvdWxkIGNvbnZlcnQuIFRoZXNlIHRyaWNrcyB3ZSBsZWFybmVkIGxlZCB0byAyNS0zMGsgZGF5cywgYW5kIGV2ZW50dWFsbHksIGRheXMgd2hlcmUgd2Ugc29sZCAxMDBrIHdvcnRoIG9mIHN1YnNjcmlwdGlvbnMuIFNvLCBteSBwb2ludD8gRG9uJ3QgYmUgc3VycHJpc2VkIGlmIEkgZ2VlayBvdXQgYW5kIGZhaW50IHdoZW4gSSBoZWFyIHlvdSB0YWxrIGFib3V0IHRyYW5zYWN0aW9uYWwgZW1haWxpbmcgYW5kIGNhZGVuY2VzIGFuZCBjb25zdW1lciBqb3VybmllcyBhbmQgc3R1ZmYgbGlrZSB0aGF0LlwiXG4gICAgfSxcbiAgICB7XG4gICAgICBcImRhdGVcIiA6IFwiUG9zdGVkIGJ5IEZyYW5jaGlubyBvbiBEZWNlbWJlciAxMCwgMjAxNFwiLFxuICAgICAgXCJoZWFkaW5nXCIgOiBcIklmIEkgY291bGQgaGF2ZSBvbmUgd2lzaDsgSSBnZXQgdG8gdXNlIHRoaXMgbWV0aG9kIHdoZW4gZGVzaWduaW5nIHlvdXIgY29uc3VtZXIgam91cm5leSBmdW5uZWwuXCIsXG4gICAgICBcImF1dGhvcmltZ1wiIDogXCIvaW1nL2ZyYW5rLnBuZ1wiLFxuICAgICAgXCJpbWdcIiA6IFwiL2ltZy9kZWMvdXhfYm9hcmQuanBnXCIsXG4gICAgICBcImJsb2JcIiA6IFwiU28gYWZ0ZXIgYSBidW5jaCBvZiBldGhub2dyYXBoaWMgc3R1ZGllcyBmcm9tIHBlcnNvbmEgbWF0Y2hlcyBJIGdhdGhlciBpbi1wZXJzb24sIEkgZ2V0IHRvIGZpbGwgYSB3YWxsIHVwIHdpdGgga2V5IHRoaW5ncyBwZW9wbGUgc2FpZCwgZmVsdCwgaGVhcmQgLSBtb3RpdmF0b3JzLCBiYXJyaWVycywgcXVlc3Rpb25zLCBhdHRpdHVkZXMgYW5kIHN1Y2guIEkgdGhlbiBncm91cCB0aGVzZSBwb3N0LWl0IHRob3VnaHRzIGluIHZhcmlvdXMgd2F5cywgbG9va2luZyBmb3IgcGF0dGVybnMsIHNlbnRpbWVudCwgbmV3IGlkZWFzLiBJIHRoZW4gdGFrZSB0aGlzIHJpY2ggZGF0YSBhbmQgZGV2ZWxvcCBhIHdoYXQgY291bGQgYmUgYnJhbmRpbmcsIGEgbGFuZGluZyBwYWdlIG9yIGFuIGVtYWlsIC0gd2l0aCB3aGF0IEkgY2FsbCwgYW4gaW52ZXJ0ZWQgcHlyYW1pZCBhcHByb2FjaCB0byBjb250ZW50LCB3aGVyZSBhZGRyZXNzaW5nIHRoZSBtb3N0IGltcG9ydGFudCB0aGluZ3MgZm91bmQgaW4gdGhlIHVzZXIgcmVzZWFyY2ggZ2V0IGFkZHJlc3NlZCBpbiBhIGhlcmlhcmNoaWNhbCBvcmRlci4gSSBjcmVhdGUgNS02IGl0ZXJhdGlvbnMgb2YgdGhlIGxhbmRpbmcgcGFnZSBhbmQgcmUtcnVuIHRoZW0gdGhyb3VnaCBhIHNlY29uZCBncm91cCBvZiBwYXJ0aWNpcGFudHMsIHN0YWtlaG9sZGVycyBhbmQgZnJpZW5kcy4gSSB0aGVuIHRha2UgZXZlbiBtb3JlIG5vdGVzIG9uIHBlb3BsZXMgc3BlYWstYWxvdWQgcmVhY3Rpb25zIHRvIHRoZSBsYW5kaW5nIHBhZ2VzLiBBZnRlciB0aGlzLCBJJ20gcmVhZHkgdG8gZGVzaWduIHRoZSBmaW5hbCBjb3B5IGFuZCBwYWdlcyBmb3IgeW91ciBmdW5uZWwuXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZGF0ZVwiIDogXCJQb3N0ZWQgYnkgRnJhbmNoaW5vIG9uIERlY2VtYmVyIDksIDIwMTRcIixcbiAgICAgIFwiaGVhZGluZ1wiIDogXCJEaWQgSSBldmVuIGJlbG9uZyBoZXJlP1wiLFxuICAgICAgXCJhdXRob3JpbWdcIiA6IFwiL2ltZy9mcmFuay5wbmdcIixcbiAgICAgIFwiaW1nXCIgOiBcIi9pbWcvZGVjL3VjbGEuanBnXCIsXG4gICAgICBcImJsb2JcIiA6IFwiVGhpcyBjb21pbmcgd2Vla2VuZCB0aGVyZSdzIHByb2JhYmx5IGEgaGFja2F0aG9uIGdvaW5nIG9uIGluIHlvdXIgY2l0eS4gU29tZSBvZiB0aGVtIGFyZSBnZXR0aW5nIHJlYWxseSBiaWcuIEkgd2Fzbid0IHJlZ2lzdGVyZWQgZm9yIExBIEhhY2tzIHRoaXMgc3VtbWVyLiBJIGRvbid0IGV2ZW4ga25vdyBob3cgSSBlbmRlZCB1cCB0aGVyZSBvbiBhIEZyaWRheSBuaWdodCwgYnV0IHdoZW4gSSBzYXcgd2hhdCB3YXMgZ29pbmcgb24sIEkgZ3JhYmJlZCBhIGNoYWlyIGFuZCBzdGFydGVkIGhhY2tpbmcgYXdheS4gV29ycmllZCBJIGhhZCBqdXN0IHNudWNrIGluIHRoZSBiYWNrIGRvb3IgYW5kIHN0YXJ0ZWQgY29tcGV0aW5nLCBteSByaWRlIGxlZnQgYW5kIHRoZXJlIEkgd2FzLCBmb3IgdGhlIG5leHQgdHdvIGRheXMuIFRoYXQncyByaWdodC4gSSBzbnVjayBpbiB0aGUgYmFjayBvZiBMQSBIYWNrcyBsYXN0IHN1bW1lciBhdCBVQ0xBIGFuZCBoYWNrZWQgd2l0aCBraWRzIDEwIHllYXJzIHlvdW5nZXIgdGhhbiBtZS4gSSBjb3VsZG4ndCBtaXNzIGl0LiBJIHdhcyBmbG9vcmVkIHdoZW4gSSBzYXcgaG93IG1hbnkgcGVvcGxlIHdlcmUgaW4gaXQuIE1lLCBiZWluZyB0aGUgbWlzY2hldmlvdXMgaGFja2VyIEkgYW0sIEkgdGhvdWdodCBpZiBJIHVzZWQgdGhlIGVuZXJneSBvZiB0aGUgZW52aXJvbm1lbnQgdG8gbXkgYWR2YW50YWdlLCBJIGNvdWxkIGJ1aWxkIHNvbWV0aGluZyBjb29sLiBMb25nIHN0b3J5IHNob3J0LCBsZXQgbWUganVzdCBzYXksIHRoYXQgaWYgeW91IGhhdmUgYmVlbiBoYXZpbmcgYSBoYXJkIHRpbWUgbGF1bmNoaW5nLCBzaWduIHVwIGZvciBhIGhhY2thdGhvbi4gSXQncyBhIGd1YXJhbnRlZWQgd2F5IHRvIG92ZXItY29tcGVuc2F0ZSBmb3IgeW91ciBjb25zdGFudCBmYWlsdXJlIHRvIGxhdW5jaC4gTW9yZSBvbiB3aGF0IGhhcHBlbmVkIHdoZW4gSSB0b29rIHRoZSBzdGFnZSBieSBzdXJwcmlzZSBhbmQgZ290IGJvb3RlZCBsYXRlci4uLlwiXG4gICAgfVxuICBdXG5cblxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnQWJvdXRDdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0FwcEN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnUmVzdW1lQ3RybCcsICgkc2NvcGUpIC0+XG4gICRzY29wZS5ibG9iID0gJzxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwibGFyZ2UtMTJcIj48ZGl2IGNsYXNzPVwicm93XCI+PGRpdiBjbGFzcz1cImxhcmdlLTEyIGNvbHVtbnNcIj48aDY+Tk9WIDIwMTMgLSBQUkVTRU5UPC9oNj48YnIvPjxoMj5IeWJyaWQgRXhwZXJpZW5jZSBEZXNpZ25lci9EZXZlbG9wZXIsIEluZGVwZW5kZW50PC9oMj48YnIvPjxwPldvcmtlZCB3aXRoIG5vdGVhYmxlIGVudHJlcHJlbm91cnMgb24gc2V2ZXJhbCBuZXcgcHJvZHVjdCBhbmQgYnVzaW5lc3MgbGF1bmNoZXMuIEhlbGQgbnVtZXJvdXMgcm9sZXMsIGluY2x1ZGluZyBjb250ZW50IHN0cmF0ZWdpc3QsIHVzZXIgcmVzZWFyY2hlciwgZGVzaWduZXIgYW5kIGRldmVsb3Blci4gPC9wPjxwPjxzdHJvbmc+Q29tcGFuaWVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cIm5vXCI+PGxpPjxhIGhyZWY9XCJodHRwOi8vdGFwY2VudGl2ZS5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5UYXBjZW50aXZlPC9hPjwvbGk+PGxpPjxhIGhyZWY9XCJodHRwOi8vY3BnLmlvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+Q1BHaW88L2E+PC9saT48bGk+PGEgaHJlZj1cImh0dHA6Ly9rb3UucG4vXCI+S291LnBuIE1lZGlhPC9hPjwvbGk+PGxpPiA8YSBocmVmPVwiaHR0cDovL21lZHljYXRpb24uY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+TWVkeWNhdGlvbjwvYT48L2xpPjxsaT4gPGEgaHJlZj1cImh0dHA6Ly93d3cuc3VudGltZXMuY29tL1wiIHRhcmdldD1cIl9ibGFua1wiPkNoaWNhZ28gU3VuIFRpbWVzPC9hPjwvbGk+PC91bD48YnIvPjxwPjxzdHJvbmc+VGFwY2VudGl2ZSBEZWxpdmVyYWJsZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5Db21wbGV0ZSBUYXBjZW50aXZlLmNvbSBtYXJrZXRpbmcgd2Vic2l0ZSBhbmQgVVggb3ZlcmhhdWwgb2YgY29yZSBwcm9kdWN0LCB0aGUgXCJUYXBjZW50aXZlIE1hbmFnZXJcIjwvbGk+PGxpPkluZHVzdHJpYWwgZGVzaWduIG9mIHRoZSBUYXBjZW50aXZlIFRvdWNocG9pbnQ8L2xpPjxsaT5Db250ZW50IHN0cmF0ZWd5IGZvciBjb3Jwb3JhdGUgbWFya2V0aW5nIHNpdGU8L2xpPjxsaT5Nb2JpbGUgZmlyc3QgbWFya2V0aW5nIHdlYnNpdGUgdXNpbmcgSW9uaWMgYW5kIEFuZ3VsYXI8L2xpPjwvdWw+PHA+PHN0cm9uZz5DUEdpbyBEZWxpdmVyYWJsZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5Qcm9kdWN0IGFuZCBidXNpbmVzcyBzdHJhdGVneSwgdGVjaG5pY2FsIGFyY2hpdGVjdHVyZSBhbmQgc3BlY2lmaWNhdGlvbiBkZXNpZ248L2xpPjxsaT5PbmUgaHVuZHJlZCBwYWdlIHByb3Bvc2FsIHRlbXBsYXRlIG9uIGJ1c2luZXNzIG1vZGVsIGFuZCBjb3Jwb3JhdGUgY2FwYWJpbGl0aWVzPC9saT48bGk+TWFya2V0aW5nIHdlYnNpdGUgZGVzaWduIGFuZCBjb250ZW50IHN0cmF0ZWd5PC9saT48bGk+Q29yZSBwcm9kdWN0IGRlc2lnbiBhbmQgTVZQIGZ1bmN0aW9uYWwgcHJvdG90eXBlPC9saT48L3VsPjxwPjxzdHJvbmc+S291LnBuIERlbGl2ZXJhYmxlczwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJidWxsZXRzXCI+PGxpPktvdS5wbiBNZWRpYSBicmFuZCByZWZyZXNoPC9saT48bGk+TWFya2V0aW5nIHNpdGUgcmVkZXNpZ248L2xpPjxsaT5Qb3J0YWwgdXNlciBleHBlcmllbmNlIG92ZXJoYXVsPC9saT48L3VsPjxwPjxzdHJvbmc+TWVkeWNhdGlvbiBEZWxpdmVyYWJsZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5Db25jZXB0dWFsIGRlc2lnbiBhbmQgYXJ0IGRpcmVjdGlvbjwvbGk+PGxpPlVzZXIgcmVzZWFyY2g8L2xpPjxsaT5SYXBpZCBwcm90b3R5cGVzPC9saT48L3VsPjxwPjxzdHJvbmc+Q2hpY2FnbyBTdW4gVGltZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5Db25jZXB0dWFsIGRlc2lnbiBhbmQgYXJ0IGRpcmVjdGlvbjwvbGk+PGxpPk5hdGl2ZSBpT1MgYW5kIEFuZHJvaWQgYXBwIGRlc2lnbiBhbmQganVuaW9yIGRldmVsb3BtZW50PC9saT48bGk+SHlicmlkIElvbmljL0FuZ3VsYXIgZGV2ZWxvcG1lbnQ8L2xpPjwvdWw+PC9kaXY+PC9kaXY+PGJyLz48ZGl2IGNsYXNzPVwicm93XCI+PGRpdiBjbGFzcz1cImxhcmdlLTEyIGNvbHVtbnNcIj48aDY+TUFSQ0ggMjAxMCAtIE9DVE9CRVIgMjAxMzwvaDY+PGJyLz48aDI+RGlyZWN0b3Igb2YgVXNlciBFeHBlcmllbmNlLCBMaWdodGJhbms8L2gyPjxici8+PHA+TGF1bmNoZWQgYW5kIHN1cHBvcnRlZCBtdWx0aXBsZSBuZXcgY29tcGFuaWVzIHdpdGhpbiB0aGUgTGlnaHRiYW5rIHBvcnRmb2xpby4gPC9wPjxwPjxzdHJvbmc+Q29tcGFuaWVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cIm5vXCI+PGxpPiA8YSBocmVmPVwiaHR0cDovL2NoaWNhZ29pZGVhcy5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5DaGljYWdvSWRlYXMuY29tPC9hPjwvbGk+PGxpPiA8YSBocmVmPVwiaHR0cDovL2JlbmNocHJlcC5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5CZW5jaFByZXAuY29tPC9hPjwvbGk+PGxpPiA8YSBocmVmPVwiaHR0cDovL3NuYXBzaGVldGFwcC5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5TbmFwU2hlZXRBcHAuY29tPC9hPjwvbGk+PGxpPk1vbnRobHlzLmNvbSAoZGVmdW5jdCk8L2xpPjxsaT4gPGEgaHJlZj1cImh0dHA6Ly9kb3VnaC5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5Eb3VnaC5jb208L2E+PC9saT48bGk+IDxhIGhyZWY9XCJodHRwOi8vZ3JvdXBvbi5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5Hcm91cG9uLmNvbTwvYT48L2xpPjwvdWw+PGJyLz48cD48c3Ryb25nPkNoaWNhZ28gSWRlYXMgRGVsaXZlcmFibGVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHNcIj48bGk+V2Vic2l0ZSBkZXNpZ24gcmVmcmVzaCwgYXJ0IGRpcmVjdGlvbjwvbGk+PGxpPkN1c3RvbSB0aWNrZXQgcHVyY2hhc2luZyBwbGF0Zm9ybSBVWCByZXNlYXJjaCAmYW1wOyBkZXNpZ248L2xpPjxsaT5SdWJ5IG9uIFJhaWxzIGRldmVsb3BtZW50LCBtYWludGVuZW5jZTwvbGk+PGxpPkdyYXBoaWMgZGVzaWduIHN1cHBvcnQ8L2xpPjxsaT5Bbm51YWwgcmVwb3J0IGRlc2lnbjwvbGk+PC91bD48cD48c3Ryb25nPkJlbmNoUHJlcC5jb20gRGVsaXZlcmFibGVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHNcIj48bGk+UmUtYnJhbmRpbmcsIGNvbXBsZXRlIEJlbmNoUHJlcCBpZGVudGl0eSBwYWNrYWdlPC9saT48bGk+U3VwcG9ydGVkIGNvbXBhbnkgd2l0aCBhbGwgZGVzaWduIGFuZCB1eCBmcm9tIHplcm8gdG8gZWlnaHQgbWlsbGlvbiBpbiBmaW5hbmNpbmc8L2xpPjxsaT5MZWFkIGFydCBhbmQgVVggZGlyZWN0aW9uIGZvciB0d28geWVhcnM8L2xpPjxsaT5Gcm9udC1lbmQgdXNpbmcgQmFja2JvbmUgYW5kIEJvb3RzdHJhcDwvbGk+PGxpPlVzZXIgcmVzZWFyY2gsIGV0aG5vZ3JhcGhpYyBzdHVkaWVzLCB1c2VyIHRlc3Rpbmc8L2xpPjxsaT5FbWFpbCBtYXJrZXRpbmcgY2FkZW5jZSBzeXN0ZW0gZGVzaWduIGFuZCBleGVjdXRpb248L2xpPjxsaT5TY3JpcHRlZCwgc3Rvcnlib2FyZGVkIGFuZCBleGVjdXRlZCBib3RoIGFuaW1hdGVkIGFuZCBsaXZlIG1vdGlvbiBleHBsYWluZXIgdmlkZW9zPC9saT48L3VsPjxwPjxzdHJvbmc+U25hcFNoZWV0QXBwLmNvbSBEZWxpdmVyYWJsZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5MYXJnZSBzY2FsZSBwb3J0YWwgVVggcmVzZWFyY2ggYW5kIGluZm9ybWF0aW9uIGFyY2hpdGVjdHVyZTwvbGk+PGxpPlRocmVlIHJvdW5kcyBvZiByYXBpZCBwcm90b3R5cGluZyBhbmQgdXNlciB0ZXN0aW5nPC9saT48bGk+R3JhcGhpYyBkZXNpZ24gYW5kIGludGVyYWN0aW9uIGRlc2lnbiBmcmFtZXdvcms8L2xpPjxsaT5Vc2VyIHRlc3Rpbmc8L2xpPjwvdWw+PHA+PHN0cm9uZz5Nb250aGx5cy5jb20gRGVsaXZlcmFibGVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHNcIj48bGk+SWRlbnRpdHkgYW5kIGFydCBkaXJlY3Rpb248L2xpPjxsaT5Qcm9kdWN0IHN0cmF0ZWd5IGFuZCBuZXcgY29tcGFueSBsYXVuY2g8L2xpPjxsaT5PbmxpbmUgbWFya2V0aW5nIHN0cmF0ZWd5LCBpbmNsdWRpbmcgdHJhbnNhY3Rpb25hbCBlbWFpbCwgcHJvbW90aW9uIGRlc2lnbiBhbmQgbGVhZCBnZW5lcmF0aW9uPC9saT48bGk+UHJvZHVjdCBleHBlcmllbmNlIGRlc2lnbiBhbmQgZnJvbnQtZW5kPC9saT48bGk+Q29udGVudCBzdHJhdGVneTwvbGk+PGxpPlNjcmlwdGVkLCBzdG9yeWJvYXJkZWQgYW5kIGV4ZWN1dGVkIGJvdGggYW5pbWF0ZWQgYW5kIGxpdmUgbW90aW9uIGV4cGxhaW5lciB2aWRlb3M8L2xpPjwvdWw+PHA+PHN0cm9uZz5Eb3VnaC5jb20gRGVsaXZlcmFibGVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHMgYnVsbGV0c1wiPjxsaT5Db25zdW1lciBqb3VybmV5IG1hcHBpbmcgYW5kIGV0aG5vZ3JhcGhpYyBzdHVkaWVzPC9saT48bGk+UmFwaWQgcHJvdG90eXBpbmcsIGNvbmNlcHR1YWwgZGVzaWduPC9saT48bGk+TWVzc2FnaW5nIHN0cmF0ZWd5LCB1c2VyIHRlc3Rpbmc8L2xpPjwvdWw+PHA+PHN0cm9uZz5Hcm91cG9uLmNvbSBEZWxpdmVyYWJsZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5FbWVyZ2luZyBtYXJrZXRzIHJlc2VhcmNoPC9saT48bGk+UmFwaWQgZGVzaWduIGFuZCBwcm90b3R5cGluZzwvbGk+PGxpPlZpc3VhbCBkZXNpZ24gb24gbmV3IGNvbmNlcHRzPC9saT48bGk+RW1haWwgc2VnbWVudGF0aW9uIHJlc2VhcmNoPC9saT48L3VsPjwvZGl2PjwvZGl2Pjxici8+PGRpdiBjbGFzcz1cInJvd1wiPjxkaXYgY2xhc3M9XCJsYXJnZS0xMiBjb2x1bW5zXCI+PGg2Pk5PVkVNQkVSIDIwMDcgLSBBUFJJTCAyMDEwPC9oNj48YnIvPjxoMj5EZXZlbG9wZXIgJmFtcDsgQ28tZm91bmRlciwgRGlsbHllby5jb208L2gyPjxici8+PHA+Q28tZm91bmRlZCwgZGVzaWduZWQgYW5kIGRldmVsb3BlZCBhIGRhaWx5IGRlYWwgZUNvbW1lcmNlIHdlYnNpdGUuPC9wPjxwPjxzdHJvbmc+Um9sZTwvc3Ryb25nPjxici8+RGVzaWduZWQsIGRldmVsb3BlZCBhbmQgbGF1bmNoZWQgY29tcGFuaWVzIGZpcnN0IGNhcnQgd2l0aCBQSFAuIEl0ZXJhdGVkIGFuZCBncmV3IHNpdGUgdG8gbW9yZSB0aGFuIHR3byBodW5kcmVkIGFuZCBmaWZ0eSB0aG91c2FuZCBzdWJzY3JpYmVycyBpbiBsZXNzIHRoYW4gb25lIHllYXIuIDwvcD48cD48c3Ryb25nPk5vdGVhYmxlIFN0YXRzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHNcIj48bGk+QnVpbHQgYSBsaXN0IG9mIDI1MCwwMDAgc3Vic2NyaWJlcnMgaW4gdGhlIGZpcnN0IHllYXI8L2xpPjxsaT5QaXZvdGVkIGFuZCB0d2Vha2VkIGRlc2lnbiwgYnVzaW5lc3MgYW5kIGFwcHJvYWNoIHRvIDEwMDAgdHJhbnNhY3Rpb25zIHBlciBkYWlseTwvbGk+PGxpPlNvbGQgYnVzaW5lc3MgaW4gRGVjZW1iZXIgMjAwOSB0byBJbm5vdmF0aXZlIENvbW1lcmNlIFNvbHV0aW9uczwvbGk+PC91bD48L2Rpdj48L2Rpdj48YnIvPjxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwibGFyZ2UtMTIgY29sdW1uc1wiPjxoNj5NQVJDSCAyMDA1IC0gT0NUT0JFUiAyMDA3PC9oNj48YnIvPjxoMj5Tb2x1dGlvbnMgQXJjaGl0ZWN0ICZhbXA7IFNlbmlvciBEZXZlbG9wZXIsIDxhIGhyZWY9XCJodHRwOi8vd3d3Lm1hbmlmZXN0ZGlnaXRhbC5jb20vXCI+TWFuaWZlc3QgRGlnaXRhbDwvYT48L2gyPjxici8+PHA+QnVpbHQgYW5kIG1hbmFnZWQgbXVsdGlwbGUgQ2FyZWVyQnVpbGRlci5jb20gbmljaGUgc2l0ZXMgZm9yIHRoZSBsYXJnZXN0IGluZGVwZW5kZW50IGFnZW5jeSBpbiB0aGUgbWlkd2VzdC48L3A+PHA+PHN0cm9uZz5Sb2xlPC9zdHJvbmc+PGJyLz5SZXNlYXJjaCBhbmQgZXhwbG9yZSBlbWVyZ2luZyB0ZWNobm9sb2dpZXMsIGltcGxlbWVudCBzb2x1dGlvbnMgYW5kIG1hbmFnZSBvdGhlciBkZXZlbG9wZXJzLiBXb3JrZWQgd2l0aCBhc3AubmV0IG9uIGEgZGFpbHkgYmFzaXMgZm9yIGFsbW9zdCB0d28geWVhcnMuIDwvcD48cD48c3Ryb25nPk5vdGVhYmxlIEFjY29tcGxpc2htZW50czwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJidWxsZXRzXCI+PGxpPlJlY29nbml6ZWQgZm9yIGxhdW5jaGluZyBoaWdoIHF1YWxpdHkgd2ViIGFwcCBmb3IgQ2FyZWVyIEJ1aWxkZXIgaW4gcmVjb3JkIHRpbWU8L2xpPjxsaT5NYW5hZ2VkIGV4dHJlbWUgU0VPIHByb2plY3Qgd2l0aCBtb3JlIHRoYW4gNTAwIHRob3VzYW5kIGxpbmtzLCBwYWdlcyBhbmQgb3ZlciA4IG1pbGxpb24gVUdDIGFydGlmYWN0czwvbGk+PGxpPlNoaWZ0ZWQgYWdlbmNpZXMgZGV2ZWxvcG1lbnQgcHJhY3RpY2VzIHRvIHZhcmlvdXMgbmV3IGNsaWVudC1jZW50cmljIEFKQVggbWV0aG9kb2xvZ2llczwvbGk+PGxpPk1hbmFnZWQgbXVsdGlwbGUgcHJvamVjdHMgY29uY3VycmVudGx5LCBpbmNsdWRpbmcgY2hvb3NlY2hpY2Fnby5jb20gYW5kIGJyaWVmaW5nLmNvbTwvbGk+PC91bD48L2Rpdj48L2Rpdj48YnIvPjxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwibGFyZ2UtMTIgY29sdW1uc1wiPjxoNj5BUFJJTCAyMDA0IC0gSkFOVUFSWSAyMDA3PC9oNj48YnIvPjxoMj5KdW5pb3IgUExEIERldmVsb3BlciwgIDxhIGhyZWY9XCJodHRwOi8vd3d3Lm1hbmlmZXN0ZGlnaXRhbC5jb20vXCI+QXZlbnVlPC9hPjwvaDI+PGJyLz48cD5Gcm9udC1lbmQgZGV2ZWxvcGVyIGFuZCBVWCBkZXNpZ24gaW50ZXJuIGZvciBBdmVudWUgQSBSYXpvcmZpc2hzXFwnIGxlZ2FjeSBjb21wYW55LCBBdmVudWUtaW5jLjwvcD48cD48c3Ryb25nPlJvbGU8L3N0cm9uZz48YnIvPkRldmVsb3AgZnJvbnQtZW5kIGZvciBtdWx0aXBsZSBjbGllbnQgd2Vic2l0ZXMsIGluY2x1ZGluZyBmbG9yLmNvbSwgYWNoaWV2ZW1lbnQub3JnLCBjYW55b25yYW5jaC5jb20gYW5kIHR1cmJvY2hlZi48L3A+PHA+PHN0cm9uZz5Ob3RlYWJsZSBBY2NvbXBsaXNobWVudHM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5FeGVjdXRlZCBmcm9udC1lbmQgcHJvamVjdHMgb24tdGltZSBhbmQgdW5kZXItYnVkZ2V0PC9saT48bGk+QXNzaWduZWQgVVggaW50ZXJuc2hpcCByb2xlLCByZWNvZ25pemVkIGJ5IGRlc2lnbiB0ZWFtIGFzIGEgeW91bmcgdGFsZW50PC9saT48bGk+V2lyZWZyYW1lZCBjdXN0b20gc2hvcHBpbmcgY2FydCBwbGF0Zm9ybSBmb3IgZmxvci5jb208L2xpPjxsaT5EZXZlbG9wZWQgaW50ZXJuYWwgU0VPIHByYWN0aWNlPC9saT48L3VsPjwvZGl2PjwvZGl2Pjxici8+PGRpdiBjbGFzcz1cInJvd1wiPjxkaXYgY2xhc3M9XCJsYXJnZS0xMiBjb2x1bW5zXCI+PGg2PkpVTFkgMjAwMCAtIEpBTlVBUlkgMjAwNDwvaDY+PGJyLz48aDI+ZUNvbW1lcmNlIERldmVsb3BlciwgQXRvdmE8L2gyPjxici8+PHA+R2VuZXJhbCB3ZWIgZGVzaWduZXIgYW5kIGRldmVsb3BlciBmb3IgZmFtaWx5IG93bmVkIHBhaW50IGRpc3RyaWJ1dGlvbiBidXNpbmVzcy4gPC9wPjxwPjxzdHJvbmc+Um9sZTwvc3Ryb25nPjxici8+QnVpbHQgc2V2ZXJhbCBzaG9wcGluZyBjYXJ0cyBpbiBjbGFzc2ljIEFTUCBhbmQgUEhQLiBHcmV3IGJ1c2luZXNzIHVzaW5nIG9ubGluZSBtYXJrZXRpbmcgc3RyYXRlZ2llcyB0byB0d28gbWlsbGlvbiBpbiByZXZlbnVlLiA8L3A+PHA+PHN0cm9uZz5Ob3RlYWJsZSBBY2NvbXBsaXNobWVudHM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5CZWNhbWUgZmlyc3QgY29tcGFueSB0byBzaGlwIHBhaW50cyBhbmQgY29hdGluZ3MgYWNyb3NzIHRoZSBVbml0ZWQgU3RhdGVzPC9saT48bGk+Rmlyc3QgZW1wbG95ZWUsIGRldmVsb3BlZCBjb21wYW55IHRvIDIrIG1pbGxpb24gaW4gcmV2ZW51ZSB3aXRoIE92ZXJ0dXJlLCBHb29nbGUgQWR3b3JkcyBhbmQgU0VPPC9saT48bGk+Q3JlYXRlZCwgbWFya2V0ZWQgYW5kIHN1YnNjcmliZWQgdm9jYXRpb25hbCBzY2hvb2wgZm9yIHNwZWNpYWx0eSBjb2F0aW5nczwvbGk+PGxpPldvcmtlZCB3aXRoIHRvcCBJdGFsaWFuIHBhaW50IG1hbnVmYWN0dXJlcnMgb3ZlcnNlYXMgdG8gYnVpbGQgZXhjbHVzaXZlIGRpc3RyaWJ1dGlvbiByaWdodHM8L2xpPjwvdWw+PC9kaXY+PC9kaXY+PGJyLz48ZGl2IGNsYXNzPVwicm93XCI+PGRpdiBjbGFzcz1cImxhcmdlLTEyIGNvbHVtbnNcIj48aDY+U0VQVEVNQkVSIDIwMDAgLSBNQVkgMjAwMjwvaDY+PGJyLz48aDI+RWR1Y2F0aW9uPC9oMj48YnIvPjxwPlNlbGYgZWR1Y2F0ZWQgZGVzaWduZXIvcHJvZ3JhbW1lciB3aXRoIHZvY2F0aW9uYWwgdHJhaW5pbmcuIDwvcD48cD48c3Ryb25nPkNlcnRpZmljYXRpb25zPC9zdHJvbmc+PGJyLz5pTkVUKywgQSsgQ2VydGlmaWNhdGlvbiA8L3A+PHA+PHN0cm9uZz5BcHByZW50aWNlc2hpcDwvc3Ryb25nPjxici8+WWVhciBsb25nIHBlcnNvbmFsIGFwcHJlbnRpY2VzaGlwIHdpdGggZmlyc3QgZW5naW5lZXIgYXQgQW1hem9uLmNvbTwvcD48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj48YnIvPjxici8+J1xuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSm9iVGFwY2VudGl2ZUN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSm9iVGFwY2VudGl2ZVR3b0N0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSm9iQ3BnaW9DdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0pvYk1lZHljYXRpb25DdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0pvYkNzdEN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSm9iS291cG5DdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0pvYk1lZHljYXRpb25DdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0pvYk1lZHljYXRpb25DdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0pvYlRyb3VuZEN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSm9iTW9udGhseXNPbmVDdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0pvYk1vbnRobHlzVHdvQ3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdKb2JCZW5jaHByZXBDdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0NvbnRhY3RDdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0RldmVsb3BlcnNDdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0RldmVsb3BlckNlbnRlckN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnRG9jc0N0cmwnLCAoJHNjb3BlLCBEb2NzKSAtPlxuICAkc2NvcGUuJHdhdGNoICgtPiBEb2NzLmxpc3QpLCAtPlxuICAgICRzY29wZS5kb2NzID0gRG9jcy5saXN0XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdEb2NDdHJsJywgKCRzY29wZSwgJHNjZSwgJHN0YXRlUGFyYW1zLCAkdGltZW91dCwgRG9jcykgLT5cbiAgJHNjb3BlLmluZGV4ID0gaWYgJHN0YXRlUGFyYW1zLnN0ZXAgdGhlbiAkc3RhdGVQYXJhbXMuc3RlcC0xIGVsc2UgMFxuXG4gICRzY29wZS4kd2F0Y2ggKC0+IERvY3MubGlzdCksIC0+XG4gICAgJHNjb3BlLmRvYyA9IERvY3MuZmluZCgkc3RhdGVQYXJhbXMucGVybWFsaW5rKVxuICAgIGlmICRzY29wZS5kb2NcbiAgICAgICRzY29wZS5zdGVwID0gJHNjb3BlLmRvYy5zdGVwc1skc2NvcGUuaW5kZXhdXG4gICAgICAkc2NvcGUuc3RlcC51cmwgPSAkc2NlLnRydXN0QXNSZXNvdXJjZVVybCgkc2NvcGUuc3RlcC51cmwpXG5cbiAgICAgIGlmICRzY29wZS5zdGVwLnR5cGUgPT0gJ2RpYWxvZydcbiAgICAgICAgJHNjb3BlLm1lc3NhZ2VJbmRleCA9IDBcbiAgICAgICAgJHNjb3BlLm1lc3NhZ2VzID0gW11cbiAgICAgICAgJHRpbWVvdXQoJHNjb3BlLm5leHRNZXNzYWdlLCAxMDAwKVxuXG4gICRzY29wZS5oYXNNb3JlU3RlcHMgPSAtPlxuICAgIGlmICRzY29wZS5zdGVwXG4gICAgICAkc2NvcGUuc3RlcC5pbmRleCA8ICRzY29wZS5kb2Muc3RlcHMubGVuZ3RoXG5cbkZyYW5jaGluby5kaXJlY3RpdmUgJ215U2xpZGVzaG93JywgLT5cbiAgcmVzdHJpY3Q6ICdBQydcbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycykgLT5cbiAgICBjb25maWcgPSBhbmd1bGFyLmV4dGVuZChcbiAgICAgIHNsaWRlczogJy5zbGlkZScsXG4gICAgc2NvcGUuJGV2YWwoYXR0cnMubXlTbGlkZXNob3cpKVxuICAgIHNldFRpbWVvdXQgKC0+XG4gICAgICAkKGVsZW1lbnQpLmN5Y2xlIC0+XG4gICAgICAgIGZ4OiAgICAgJ2ZhZGUnLFxuICAgICAgICBzcGVlZDogICdmYXN0JyxcbiAgICAgICAgbmV4dDogICAnI25leHQyJyxcbiAgICAgICAgcHJldjogICAnI3ByZXYyJyxcbiAgICAgICAgY2FwdGlvbjogJyNhbHQtY2FwdGlvbicsXG4gICAgICAgIGNhcHRpb25fdGVtcGxhdGU6ICd7e2ltYWdlcy5hbHR9fScsXG4gICAgICAgIHBhdXNlX29uX2hvdmVyOiAndHJ1ZSdcblxuICAgICksIDBcbiIsIkFVVEgwX0NMSUVOVF9JRCA9ICdBMTI2WFdkSlpZNzE1dzNCNnlWQ2V2cFM4dFltUEpyaidcbkFVVEgwX0RPTUFJTiA9ICdmb290YnJvcy5hdXRoMC5jb20nXG5BVVRIMF9DQUxMQkFDS19VUkwgPSBsb2NhdGlvbi5ocmVmIiwid2luZG93LkZyYW5jaGlubyA9IGFuZ3VsYXIubW9kdWxlKCd0YXAuY29udHJvbGxlcnMnLCBbXSlcblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0xvZ2luQ3RybCcsICgkc2NvcGUsIGF1dGgsICRzdGF0ZSwgc3RvcmUpIC0+XG5cbiAgZG9BdXRoID0gLT5cbiAgICBhdXRoLnNpZ25pbiB7XG4gICAgICBjbG9zYWJsZTogZmFsc2VcbiAgICAgIGF1dGhQYXJhbXM6IHNjb3BlOiAnb3BlbmlkIG9mZmxpbmVfYWNjZXNzJ1xuICAgIH1cbiAgICByZXR1cm5cblxuICAkc2NvcGUuJG9uICckaW9uaWMucmVjb25uZWN0U2NvcGUnLCAtPlxuICAgIGRvQXV0aCgpXG4gICAgcmV0dXJuXG4gIGRvQXV0aCgpXG4gIHJldHVyblxuXG5cbkZyYW5jaGluby5jb250cm9sbGVyICdJbnRyb0N0cmwnLCAoJHNjb3BlLCAkc3RhdGUsICRpb25pY1NsaWRlQm94RGVsZWdhdGUpIC0+XG4gICRzY29wZS5zdGFydEFwcCA9IC0+XG4gICAgJHN0YXRlLmdvKCdhcHAucHJvZHVjdHMnKVxuXG4gICRzY29wZS5uZXh0ID0gLT5cbiAgICAkaW9uaWNTbGlkZUJveERlbGVnYXRlLm5leHQoKVxuXG4gICRzY29wZS5wcmV2aW91cyA9IC0+XG4gICAgJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZS5wcmV2aW91cygpXG5cblxuICAkc2NvcGUuc2xpZGVDaGFuZ2VkID0gKGluZGV4KSAtPlxuICAgICRzY29wZS5zbGlkZUluZGV4ID0gaW5kZXhcblxuICByZXR1cm5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0FwcEN0cmwnLCAoJHNjb3BlKSAtPlxuICAjIFdpdGggdGhlIG5ldyB2aWV3IGNhY2hpbmcgaW4gSW9uaWMsIENvbnRyb2xsZXJzIGFyZSBvbmx5IGNhbGxlZFxuICAjIHdoZW4gdGhleSBhcmUgcmVjcmVhdGVkIG9yIG9uIGFwcCBzdGFydCwgaW5zdGVhZCBvZiBldmVyeSBwYWdlIGNoYW5nZS5cbiAgIyBUbyBsaXN0ZW4gZm9yIHdoZW4gdGhpcyBwYWdlIGlzIGFjdGl2ZSAoZm9yIGV4YW1wbGUsIHRvIHJlZnJlc2ggZGF0YSksXG4gICMgbGlzdGVuIGZvciB0aGUgJGlvbmljVmlldy5lbnRlciBldmVudDpcbiAgIyRzY29wZS4kb24oJyRpb25pY1ZpZXcuZW50ZXInLCBmdW5jdGlvbihlKSB7XG4gICN9KTtcbiAgcmV0dXJuXG5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0Rhc2hDdHJsJywgKCRzY29wZSwgJGh0dHApIC0+XG5cbiAgJHNjb3BlLmNhbGxBcGkgPSAtPlxuICAgICMgSnVzdCBjYWxsIHRoZSBBUEkgYXMgeW91J2QgZG8gdXNpbmcgJGh0dHBcbiAgICAkaHR0cChcbiAgICAgIHVybDogJ2h0dHA6Ly9hdXRoMC1ub2RlanNhcGktc2FtcGxlLmhlcm9rdWFwcC5jb20vc2VjdXJlZC9waW5nJ1xuICAgICAgbWV0aG9kOiAnR0VUJykudGhlbiAoLT5cbiAgICAgIGFsZXJ0ICdXZSBnb3QgdGhlIHNlY3VyZWQgZGF0YSBzdWNjZXNzZnVsbHknXG4gICAgICByZXR1cm5cbiAgICApLCAtPlxuICAgICAgYWxlcnQgJ1BsZWFzZSBkb3dubG9hZCB0aGUgQVBJIHNlZWQgc28gdGhhdCB5b3UgY2FuIGNhbGwgaXQuJ1xuICAgICAgcmV0dXJuXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuXG5cbiMgLS0tXG4jIGdlbmVyYXRlZCBieSBqczJjb2ZmZWUgMi4wLjRcbiIsImFuZ3VsYXIubW9kdWxlKFwidGFwLmRpcmVjdGl2ZXNcIiwgW10pXG4gIC5kaXJlY3RpdmUgXCJkZXZpY2VcIiwgLT5cbiAgICByZXN0cmljdDogXCJBXCJcbiAgICBsaW5rOiAtPlxuICAgICAgZGV2aWNlLmluaXQoKVxuXG4gIC5zZXJ2aWNlICdjb3B5JywgKCRzY2UpIC0+XG4gICAgY29weSA9XG4gICAgICBhYm91dDpcbiAgICAgICAgaGVhZGluZzogXCJXZSdyZSA8c3Ryb25nPnRhcHBpbmc8L3N0cm9uZz4gaW50byB0aGUgZnV0dXJlXCJcbiAgICAgICAgc3ViX2hlYWRpbmc6IFwiVGFwY2VudGl2ZSB3YXMgY3JlYXRlZCBieSBhIHRlYW0gdGhhdCBoYXMgbGl2ZWQgdGhlIG1vYmlsZSBjb21tZXJjZSByZXZvbHV0aW9uIGZyb20gdGhlIGVhcmxpZXN0IGRheXMgb2YgbUNvbW1lcmNlIHdpdGggV0FQLCB0byBsZWFkaW5nIHRoZSBjaGFyZ2UgaW4gbW9iaWxlIHBheW1lbnRzIGFuZCBzZXJ2aWNlcyB3aXRoIE5GQyB3b3JsZHdpZGUuXCJcbiAgICAgICAgY29weTogXCI8cD5Gb3IgdXMsIG1vYmlsZSBjb21tZXJjZSBoYXMgYWx3YXlzIGJlZW4gYWJvdXQgbXVjaCBtb3JlIHRoYW4gcGF5bWVudDogIG1hcmtldGluZywgcHJvbW90aW9ucywgcHJvZHVjdCBjb250ZW50LCBhbmQgbG95YWx0eSwgYWxsIGNvbWUgdG8gbGlmZSBpbnNpZGUgYSBtb2JpbGUgcGhvbmUuIE1vYmlsZSBjb21tZXJjZSByZWFsbHkgZ2V0cyBpbnRlcmVzdGluZyB3aGVuIGl0IGJyaWRnZXMgdGhlIGRpZ2l0YWwgYW5kIHBoeXNpY2FsIHdvcmxkcy48L3A+PHA+T3VyIGdvYWwgYXQgVGFwY2VudGl2ZSBpcyB0byBjcmVhdGUgYSBzdGF0ZS1vZi10aGUtYXJ0IG1vYmlsZSBlbmdhZ2VtZW50IHBsYXRmb3JtIHRoYXQgZW5hYmxlcyBtYXJrZXRlcnMgYW5kIGRldmVsb3BlcnMgdG8gY3JlYXRlIGVudGlyZWx5IG5ldyBjdXN0b21lciBleHBlcmllbmNlcyBpbiBwaHlzaWNhbCBsb2NhdGlvbnMg4oCTIGFsbCB3aXRoIGEgbWluaW11bSBhbW91bnQgb2YgdGVjaG5vbG9neSBkZXZlbG9wbWVudC48L3A+PHA+V2UgdGhpbmsgeW914oCZbGwgbGlrZSB3aGF0IHdl4oCZdmUgYnVpbHQgc28gZmFyLiBBbmQganVzdCBhcyBtb2JpbGUgdGVjaG5vbG9neSBpcyBjb25zdGFudGx5IGV2b2x2aW5nLCBzbyBpcyB0aGUgVGFwY2VudGl2ZSBwbGF0Zm9ybS4gR2l2ZSBpdCBhIHRlc3QgZHJpdmUgdG9kYXkuPC9wPlwiXG4gICAgICB0ZWFtOlxuICAgICAgICBoZWFkaW5nOiBcIlwiXG4gICAgICAgIGJpb3M6XG4gICAgICAgICAgZGF2ZV9yb2xlOiBcIlwiXG4gICAgICAgICAgZGF2ZV9jb3B5OiBcIlwiXG4gICAgXG5cblxuICAgIHRydXN0VmFsdWVzID0gKHZhbHVlcykgLT5cbiAgICAgIF8uZWFjaCB2YWx1ZXMsICh2YWwsIGtleSkgLT5cbiAgICAgICAgc3dpdGNoIHR5cGVvZih2YWwpXG4gICAgICAgICAgd2hlbiAnc3RyaW5nJ1xuICAgICAgICAgICAgJHNjZS50cnVzdEFzSHRtbCh2YWwpXG4gICAgICAgICAgd2hlbiAnb2JqZWN0J1xuICAgICAgICAgICAgdHJ1c3RWYWx1ZXModmFsKVxuXG4gICAgdHJ1c3RWYWx1ZXMoY29weSlcblxuICAgIGNvcHlcbiIsImlmIGRldmljZS5kZXNrdG9wKClcblxuZWxzZSBpZiBkZXZpY2UubW9iaWxlKClcblxuXHQkID0gZG9jdW1lbnQgIyBzaG9ydGN1dFxuXHRjc3NJZCA9ICdteUNzcycgIyB5b3UgY291bGQgZW5jb2RlIHRoZSBjc3MgcGF0aCBpdHNlbGYgdG8gZ2VuZXJhdGUgaWQuLlxuXHRpZiAhJC5nZXRFbGVtZW50QnlJZChjc3NJZClcblx0ICAgIGhlYWQgID0gJC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdXG5cdCAgICBsaW5rICA9ICQuY3JlYXRlRWxlbWVudCgnbGluaycpXG5cdCAgICBsaW5rLmlkICAgPSBjc3NJZFxuXHQgICAgbGluay5yZWwgID0gJ3N0eWxlc2hlZXQnXG5cdCAgICBsaW5rLnR5cGUgPSAndGV4dC9jc3MnXG5cdCAgICBsaW5rLmhyZWYgPSAnL2Nzcy9pb25pYy5hcHAubWluLmNzcydcblx0ICAgIGxpbmsubWVkaWEgPSAnYWxsJ1xuXHQgICAgaGVhZC5hcHBlbmRDaGlsZChsaW5rKVxuIiwid2luZG93LkZyYW5jaGlubyA9IGFuZ3VsYXIubW9kdWxlKCd0YXAucHJvZHVjdCcsIFtdKVxuXG5GcmFuY2hpbm8uZmFjdG9yeSAnUHJvZHVjdCcsICgkaHR0cCwgJHJvb3RTY29wZSkgLT5cbiAgeyBhbGw6IChxdWVyeVN0cmluZykgLT5cbiAgICAkaHR0cC5nZXQgJHJvb3RTY29wZS5zZXJ2ZXIgKyAnL3Byb2R1Y3RzJywgcGFyYW1zOiBxdWVyeVN0cmluZ1xuIH1cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ1Byb2R1Y3RMaXN0Q3RybCcsICgkc2NvcGUsICRyb290U2NvcGUsICRpb25pY1Njcm9sbERlbGVnYXRlLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCBQcm9kdWN0KSAtPlxuICAkc2NvcGUucHJvZHVjdHMgPSBbXVxuICBwYWdlU2l6ZSA9IDIwXG4gIHByb2R1Y3RDb3VudCA9IDFcbiAgcGFnZSA9IDBcblxuICAkc2NvcGUuY2xlYXJTZWFyY2ggPSAtPlxuICAgICRzY29wZS5zZWFyY2hLZXkgPSAnJ1xuICAgICRzY29wZS5sb2FkRGF0YSgpXG4gICAgcmV0dXJuXG5cbiAgJHJvb3RTY29wZS4kb24gJ3NlYXJjaEtleUNoYW5nZScsIChldmVudCwgc2VhcmNoS2V5KSAtPlxuICAgICRzY29wZS5zZWFyY2hLZXkgPSBzZWFyY2hLZXlcbiAgICAkc2NvcGUubG9hZERhdGEoKVxuICAgIHJldHVyblxuXG4gICRzY29wZS5mb3JtYXRBbGNvaG9sTGV2ZWwgPSAodmFsKSAtPlxuICAgIHBhcnNlRmxvYXQgdmFsXG5cbiAgJHNjb3BlLmxvYWREYXRhID0gLT5cbiAgICBwYWdlID0gMVxuICAgIHJhbmdlID0gMVxuICAgIFByb2R1Y3QuYWxsKFxuICAgICAgc2VhcmNoOiAkc2NvcGUuc2VhcmNoS2V5XG4gICAgICBtaW46IHJhbmdlWzBdXG4gICAgICBtYXg6IHJhbmdlWzFdXG4gICAgICBwYWdlOiBwYWdlXG4gICAgICBwYWdlU2l6ZTogcGFnZVNpemUpLnN1Y2Nlc3MgKHJlc3VsdCkgLT5cbiAgICAgICRzY29wZS5wcm9kdWN0cyA9IHJlc3VsdC5wcm9kdWN0c1xuICAgICAgcHJvZHVjdENvdW50ID0gcmVzdWx0LnRvdGFsXG4gICAgICAkaW9uaWNTY3JvbGxEZWxlZ2F0ZS4kZ2V0QnlIYW5kbGUoJ215U2Nyb2xsJykuZ2V0U2Nyb2xsVmlldygpLnNjcm9sbFRvIDAsIDAsIHRydWVcbiAgICAgICRzY29wZS4kYnJvYWRjYXN0ICdzY3JvbGwuaW5maW5pdGVTY3JvbGxDb21wbGV0ZSdcbiAgICAgIHJldHVyblxuICAgIHJldHVyblxuXG4gICRzY29wZS5sb2FkTW9yZURhdGEgPSAtPlxuICAgIHBhZ2UrK1xuICAgIHJhbmdlID0gMVxuICAgIFByb2R1Y3QuYWxsKFxuICAgICAgc2VhcmNoOiAkc2NvcGUuc2VhcmNoS2V5XG4gICAgICBtaW46IHJhbmdlWzBdXG4gICAgICBtYXg6IHJhbmdlWzFdXG4gICAgICBwYWdlOiBwYWdlXG4gICAgICBwYWdlU2l6ZTogcGFnZVNpemUpLnN1Y2Nlc3MgKHJlc3VsdCkgLT5cbiAgICAgIHByb2R1Y3RDb3VudCA9IHJlc3VsdC50b3RhbFxuICAgICAgQXJyYXk6OnB1c2guYXBwbHkgJHNjb3BlLnByb2R1Y3RzLCByZXN1bHQucHJvZHVjdHNcbiAgICAgICRzY29wZS4kYnJvYWRjYXN0ICdzY3JvbGwuaW5maW5pdGVTY3JvbGxDb21wbGV0ZSdcbiAgICAgIHJldHVyblxuICAgIHJldHVyblxuXG4gICRzY29wZS5pc01vcmVEYXRhID0gLT5cbiAgICBwYWdlIDwgcHJvZHVjdENvdW50IC8gcGFnZVNpemVcblxuICByZXR1cm5cblxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnUHJvZHVjdERldGFpbEN0cmwnLCAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJHNjZSwgUHJvZHVjdCwgJGlvbmljSGlzdG9yeSkgLT5cbiAgXG4gICRzY29wZS5teUdvQmFjayA9IC0+XG4gICAgJGlvbmljSGlzdG9yeS5nb0JhY2soKVxuICAgIHJldHVyblxuXG4gICRzY29wZS5wcm9kdWN0ID1cbiAgICBuYW1lOiAkc3RhdGVQYXJhbXMubmFtZVxuICAgIGJyZXdlcnk6ICRzdGF0ZVBhcmFtcy5icmV3ZXJ5XG4gICAgYWxjb2hvbDogJHN0YXRlUGFyYW1zLmFsY29ob2xcbiAgICB2aWRlbzogJHN0YXRlUGFyYW1zLnZpZGVvXG4gICAgdGFnczogJHN0YXRlUGFyYW1zLnRhZ3NcbiAgJHNjb3BlLnRhZ3MgPSAkc2NvcGUucHJvZHVjdC50YWdzLnNwbGl0KCcsICcpXG5cbiAgJHNjb3BlLnNldFNlYXJjaEtleSA9IChzZWFyY2hLZXkpIC0+XG4gICAgJHJvb3RTY29wZS4kZW1pdCAnc2VhcmNoS2V5Q2hhbmdlJywgc2VhcmNoS2V5XG4gICAgJHN0YXRlLmdvICdwcm9kdWN0cydcbiAgICByZXR1cm5cblxuICAkc2NvcGUuZm9ybWF0QWxjb2hvbExldmVsID0gKHZhbCkgLT5cbiAgICAnJyArIHBhcnNlRmxvYXQodmFsKSArICclJ1xuXG4gICRzY29wZS5mb3JtYXRZb3V0dWJlVXJsID0gKHZhbCkgLT5cbiAgICAkc2NvcGUuY3VycmVudFVybCA9ICdodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC8nICsgdmFsICsgJydcbiAgICAkc2NvcGUuYmV0dGVyVXJsID0gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoJHNjb3BlLmN1cnJlbnRVcmwpXG4gICAgJHNjb3BlLmJldHRlclVybFxuXG4gIHJldHVyblxuXG4jIC0tLVxuIyBnZW5lcmF0ZWQgYnkganMyY29mZmVlIDIuMC40Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9