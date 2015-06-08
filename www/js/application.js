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
  authProvider.on("loginSuccess", function($location, profilePromise, idToken, store, refreshToken) {
    return profilePromise.then(function(profile) {
      var lock;
      lock = new Auth0Lock('A126XWdJZY715w3B6yVCevpS8tYmPJrj', 'footbros.auth0.com');
      store.set('profile', profile);
      store.set('token', idToken);
      store.set('refreshToken', refreshToken);
      localStorage.setItem('token', idToken);
      return window.location.href = 'localhost:3000';
    });
  });
  authProvider.on("authenticated", function($location, error) {
    return $location.url('localhost:3000');
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiLCJhdXRoMC12YXJpYWJsZXMuY29mZmVlIiwiY29udHJvbGxlcnMuY29mZmVlIiwiZGlyZWN0aXZlcy5jb2ZmZWUiLCJpbml0LmNvZmZlZSIsInByb2R1Y3QuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUcsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFIO0FBQ0UsRUFBQSxNQUFNLENBQUMsU0FBUCxHQUFtQixPQUFPLENBQUMsTUFBUixDQUFlLFdBQWYsRUFBNEIsQ0FBQyxZQUFELEVBQWUsV0FBZixFQUE0QixrQkFBNUIsRUFBZ0QsaUJBQWhELEVBQW1FLGdCQUFuRSxDQUE1QixDQUFuQixDQURGO0NBQUEsTUFBQTtBQUlFLEVBQUEsTUFBTSxDQUFDLFNBQVAsR0FBbUIsT0FBTyxDQUFDLE1BQVIsQ0FBZSxXQUFmLEVBQTRCLENBQUUsT0FBRixFQUM3QyxrQkFENkMsRUFFN0MsaUJBRjZDLEVBRzdDLGdCQUg2QyxFQUk3QyxhQUo2QyxFQUs3QyxPQUw2QyxFQU03QyxpQkFONkMsRUFPN0MsYUFQNkMsQ0FBNUIsQ0FBbkIsQ0FKRjtDQUFBOztBQUFBLFNBYVMsQ0FBQyxHQUFWLENBQWMsU0FBQyxjQUFELEVBQWlCLFVBQWpCLEdBQUE7QUFDWixFQUFBLFVBQVUsQ0FBQyxNQUFYLEdBQW9CLHVCQUFwQixDQUFBO0FBQUEsRUFDQSxjQUFjLENBQUMsS0FBZixDQUFxQixTQUFBLEdBQUE7QUFDakIsSUFBQSxJQUFHLE1BQU0sQ0FBQyxTQUFWO0FBQ0UsTUFBQSxTQUFTLENBQUMsWUFBVixDQUFBLENBQUEsQ0FERjtLQUFBO0FBSUEsSUFBQSxJQUFHLE1BQU0sQ0FBQyxPQUFQLElBQW1CLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQTdDO0FBQ0UsTUFBQSxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyx3QkFBekIsQ0FBa0QsSUFBbEQsQ0FBQSxDQURGO0tBSkE7QUFNQSxJQUFBLElBQUcsTUFB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QUFNLENBQUMsU0FBUCxHQUFtQixJQUFJLENBQUMsa0JBQUwsQ0FBd0IsTUFBTSxDQUFDLFVBQS9CLENBRG5CLENBQUE7V0FFQSxNQUFNLENBQUMsVUFIaUI7RUFBQSxDQXBCMUIsQ0FGd0M7QUFBQSxDQUExQyxDQS9EQSxDQUFBIiwiZmlsZSI6ImFwcGxpY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaWYgZGV2aWNlLmRlc2t0b3AoKVxuICB3aW5kb3cuRnJhbmNoaW5vID0gYW5ndWxhci5tb2R1bGUoJ0ZyYW5jaGlubycsIFsnbmdTYW5pdGl6ZScsICd1aS5yb3V0ZXInLCAnYnRmb3JkLnNvY2tldC1pbycsICd0YXAuY29udHJvbGxlcnMnLCAndGFwLmRpcmVjdGl2ZXMnXSlcblxuZWxzZVxuICB3aW5kb3cuRnJhbmNoaW5vID0gYW5ndWxhci5tb2R1bGUoXCJGcmFuY2hpbm9cIiwgWyAnaW9uaWMnLFxuICAgICdidGZvcmQuc29ja2V0LWlvJyxcbiAgICAndGFwLmNvbnRyb2xsZXJzJyxcbiAgICAndGFwLmRpcmVjdGl2ZXMnLFxuICAgICd0YXAucHJvZHVjdCcsXG4gICAgJ2F1dGgwJyxcbiAgICAnYW5ndWxhci1zdG9yYWdlJyxcbiAgICAnYW5ndWxhci1qd3QnXSlcblxuRnJhbmNoaW5vLnJ1biAoJGlvbmljUGxhdGZvcm0sICRyb290U2NvcGUpIC0+XG4gICRyb290U2NvcGUuc2VydmVyID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMCdcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkgLT5cbiAgICAgIGlmIHdpbmRvdy5TdGF0dXNCYXJcbiAgICAgICAgU3RhdHVzQmFyLnN0eWxlRGVmYXVsdCgpXG4gICAgICAjIEhpZGUgdGhlIGFjY2Vzc29yeSBiYXIgYnkgZGVmYXVsdCAocmVtb3ZlIHRoaXMgdG8gc2hvdyB0aGUgYWNjZXNzb3J5IGJhciBhYm92ZSB0aGUga2V5Ym9hcmRcbiAgICAgICMgZm9yIGZvcm0gaW5wdXRzKVxuICAgICAgaWYgd2luZG93LmNvcmRvdmEgYW5kIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmRcbiAgICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmhpZGVLZXlib2FyZEFjY2Vzc29yeUJhciB0cnVlXG4gICAgICBpZiB3aW5kb3cuU3RhdHVzQmFyXG4gICAgICAgICMgb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxuICAgICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KClcbiAgICAgIHJldHVyblxuICAgIHJldHVyblxuXG5cbkZyYW5jaGluby5jb25maWcgKCRzY2VEZWxlZ2F0ZVByb3ZpZGVyKSAtPlxuICAkc2NlRGVsZWdhdGVQcm92aWRlci5yZXNvdXJjZVVybFdoaXRlbGlzdCBbXG4gICAgICAnc2VsZidcbiAgICAgIG5ldyBSZWdFeHAoJ14oaHR0cFtzXT8pOi8vKHd7M30uKT95b3V0dWJlLmNvbS8uKyQnKVxuICAgIF1cbiAgcmV0dXJuXG5cblxuRnJhbmNoaW5vLmNvbmZpZyAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICRodHRwUHJvdmlkZXIsIGF1dGhQcm92aWRlciwgand0SW50ZXJjZXB0b3JQcm92aWRlcikgLT5cblxuICAkc3RhdGVQcm92aWRlclxuXG4gICAgLnN0YXRlICdhcHAnLFxuICAgICAgdXJsOiAnJ1xuICAgICAgYWJzdHJhY3Q6IHRydWVcbiAgICAgIGNvbnRyb2xsZXI6ICdBcHBDdHJsJ1xuICAgICAgdGVtcGxhdGVVcmw6ICdtZW51Lmh0bWwnXG5cbiAgICAuc3RhdGUoJ2xvZ2luJyxcbiAgICAgIHVybDogJy9sb2dpbidcbiAgICAgIHRlbXBsYXRlVXJsOiAnbG9naW4uaHRtbCdcbiAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnKVxuXG4gICAgLnN0YXRlKCdhcHAucHJvZHVjdHMnLFxuICAgICAgdXJsOiAnL3Byb2R1Y3RzJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAncHJvZHVjdC1saXN0Lmh0bWwnXG4gICAgICAgICAgY29udHJvbGxlcjogJ1Byb2R1Y3RMaXN0Q3RybCcpXG5cbiAgICAuc3RhdGUgJ2FwcC5wcm9kdWN0LWRldGFpbCcsXG4gICAgICB1cmw6ICcvcHJvZHVjdC86bmFtZS86YnJld2VyeS86YWxjb2hvbC86dGFncy86dmlkZW8nXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdwcm9kdWN0LWRldGFpbC5odG1sJ1xuICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0RGV0YWlsQ3RybCdcblxuICAgIC5zdGF0ZSAnYXBwLmludHJvJyxcbiAgICAgIHVybDogJy9pbnRybycsXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0ludHJvQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2ludHJvLmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5ob21lJyxcbiAgICAgIHVybDogJy9ob21lJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2hvbWUuaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmRvY3MnLFxuICAgICAgdXJsOiAnL2RvY3MnXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0RvY3NDdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZG9jcy9pbmRleC5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuYWJvdXQnLFxuICAgICAgdXJsOiAnL2Fib3V0J1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdBYm91dEN0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhYm91dC5odG1sJ1xuXG5cbiAgICAuc3RhdGUgJ2FwcC5ibG9nJyxcbiAgICAgIHVybDogJy9ibG9nJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdCbG9nQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2Jsb2cuaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLnJlc3VtZScsXG4gICAgICB1cmw6ICcvcmVzdW1lJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXN1bWVDdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAncmVzdW1lLmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5jb250YWN0JyxcbiAgICAgIHVybDogJy9jb250YWN0J1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdDb250YWN0Q3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbnRhY3QuaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmRvYycsXG4gICAgICB1cmw6ICcvZG9jcy86cGVybWFsaW5rJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdEb2NDdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZG9jcy9zaG93Lmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5zdGVwJyxcbiAgICAgIHVybDogJy9kb2NzLzpwZXJtYWxpbmsvOnN0ZXAnXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0RvY0N0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdkb2NzL3Nob3cuaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmpvYi10YXBjZW50aXZlJyxcbiAgICAgIHVybDogJy9qb2ItdGFwY2VudGl2ZSdcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnSm9iVGFwY2VudGl2ZUN0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdqb2ItdGFwY2VudGl2ZS5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuam9iLXRhcGNlbnRpdmUtdHdvJyxcbiAgICAgIHVybDogJy9qb2ItdGFwY2VudGl2ZS10d28nXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0pvYlRhcGNlbnRpdmVUd29DdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnam9iLXRhcGNlbnRpdmUtdHdvLmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5qb2ItY3BnaW8nLFxuICAgICAgdXJsOiAnL2pvYi1jcGdpbydcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnSm9iQ3BnaW9DdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnam9iLWNwZ2lvLmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5qb2ItbWVkeWNhdGlvbicsXG4gICAgICB1cmw6ICcvam9iLW1lZHljYXRpb24nXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0pvYk1lZHljYXRpb25DdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnam9iLW1lZHljYXRpb24uaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmpvYi1jc3QnLFxuICAgICAgdXJsOiAnL2pvYi1jc3QnXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0pvYkNzdEN0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdqb2ItY3N0Lmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5qb2Ita291cG4nLFxuICAgICAgdXJsOiAnL2pvYi1rb3VwbidcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnSm9iS291cG5DdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnam9iLWtvdXBuLmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5qb2ItdHJvdW5kJyxcbiAgICAgIHVybDogJy9qb2ItdHJvdW5kJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdKb2JUcm91bmRDdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnam9iLXRyb3VuZC5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuam9iLW1vbnRobHlzJyxcbiAgICAgIHVybDogJy9qb2ItbW9udGhseXMnXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0pvYk1vbnRobHlzQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2pvYi1tb250aGx5cy5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuam9iLW1vbnRobHlzLXR3bycsXG4gICAgICB1cmw6ICcvam9iLW1vbnRobHlzLXR3bydcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnSm9iTW9udGhseXNUd29DdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnam9iLW1vbnRobHlzLXR3by5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuam9iLWJlbmNocHJlcCcsXG4gICAgICB1cmw6ICcvam9iLWJlbmNocHJlcCdcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnSm9iQmVuY2hwcmVwQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2pvYi1iZW5jaHByZXAuaHRtbCdcblxuICAgICAgICAjIENvbmZpZ3VyZSBBdXRoMFxuICAgICAgYXV0aFByb3ZpZGVyLmluaXRcbiAgICAgICAgZG9tYWluOiBBVVRIMF9ET01BSU5cbiAgICAgICAgY2xpZW50SUQ6IEFVVEgwX0NMSUVOVF9JRFxuICAgICAgICBzc286IHRydWVcbiAgICAgICAgbG9naW5TdGF0ZTogJ3Byb2R1Y3RzJ1xuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSBcIi9wcm9kdWN0c1wiXG5cbiAgICBqd3RJbnRlcmNlcHRvclByb3ZpZGVyLnRva2VuR2V0dGVyID0gKHN0b3JlLCBqd3RIZWxwZXIsIGF1dGgpIC0+XG4gICAgICBpZFRva2VuID0gc3RvcmUuZ2V0KCd0b2tlbicpXG4gICAgICByZWZyZXNoVG9rZW4gPSBzdG9yZS5nZXQoJ3JlZnJlc2hUb2tlbicpXG4gICAgICBpZiAhaWRUb2tlbiBvciAhcmVmcmVzaFRva2VuXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICBpZiBqd3RIZWxwZXIuaXNUb2tlbkV4cGlyZWQoaWRUb2tlbilcbiAgICAgICAgYXV0aC5yZWZyZXNoSWRUb2tlbihyZWZyZXNoVG9rZW4pLnRoZW4gKGlkVG9rZW4pIC0+XG4gICAgICAgICAgc3RvcmUuc2V0ICd0b2tlbicsIGlkVG9rZW5cbiAgICAgICAgICBpZFRva2VuXG4gICAgICBlbHNlXG4gICAgICAgIGlkVG9rZW5cblxuICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCAnand0SW50ZXJjZXB0b3InXG4gICAgICByZXR1cm5cblxuICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2ggLT5cbiAgICAgICByZXF1ZXN0OiAoY29uZmlnKSAtPlxuICAgICAgICAgaWYgY29uZmlnLnVybC5tYXRjaCgvXFwuaHRtbCQvKSAmJiAhY29uZmlnLnVybC5tYXRjaCgvXnNoYXJlZFxcLy8pXG4gICAgICAgICAgIGlmIGRldmljZS50YWJsZXQoKVxuICAgICAgICAgICAgIHR5cGUgPSAndGFibGV0J1xuICAgICAgICAgICBlbHNlIGlmIGRldmljZS5tb2JpbGUoKVxuICAgICAgICAgICAgIHR5cGUgPSAnbW9iaWxlJ1xuICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgdHlwZSA9ICdkZXNrdG9wJ1xuXG4gICAgICAgICAgIGNvbmZpZy51cmwgPSBcIi8je3R5cGV9LyN7Y29uZmlnLnVybH1cIlxuXG4gICAgICAgICBjb25maWdcblxuICBhdXRoUHJvdmlkZXIub24gXCJsb2dpblN1Y2Nlc3NcIiwgKCRsb2NhdGlvbiwgcHJvZmlsZVByb21pc2UsIGlkVG9rZW4sIHN0b3JlLCByZWZyZXNoVG9rZW4pIC0+XG4gICAgcHJvZmlsZVByb21pc2UudGhlbiAocHJvZmlsZSkgLT5cbiAgICAgIGxvY2sgPSBuZXcgQXV0aDBMb2NrKCdBMTI2WFdkSlpZNzE1dzNCNnlWQ2V2cFM4dFltUEpyaicsICdmb290YnJvcy5hdXRoMC5jb20nKTtcblxuICAgICAgc3RvcmUuc2V0ICdwcm9maWxlJywgcHJvZmlsZVxuICAgICAgc3RvcmUuc2V0ICd0b2tlbicsIGlkVG9rZW5cbiAgICAgIHN0b3JlLnNldCAncmVmcmVzaFRva2VuJywgcmVmcmVzaFRva2VuXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9rZW4nLCBpZFRva2VuKTtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ2xvY2FsaG9zdDozMDAwJ1xuXG4gIGF1dGhQcm92aWRlci5vbiBcImF1dGhlbnRpY2F0ZWRcIiwgKCRsb2NhdGlvbiwgZXJyb3IpIC0+XG4gICAgJGxvY2F0aW9uLnVybCAnbG9jYWxob3N0OjMwMDAnXG5cblxuICBhdXRoUHJvdmlkZXIub24gXCJsb2dpbkZhaWx1cmVcIiwgKCRsb2NhdGlvbiwgZXJyb3IpIC0+XG5cblxuRnJhbmNoaW5vLnJ1biAoJHJvb3RTY29wZSwgYXV0aCwgc3RvcmUpIC0+XG4gICRyb290U2NvcGUuJG9uICckbG9jYXRpb25DaGFuZ2VTdGFydCcsIC0+XG4gICAgaWYgIWF1dGguaXNBdXRoZW50aWNhdGVkXG4gICAgICB0b2tlbiA9IHN0b3JlLmdldCgndG9rZW4nKVxuICAgICAgaWYgdG9rZW5cbiAgICAgICAgYXV0aC5hdXRoZW50aWNhdGUgc3RvcmUuZ2V0KCdwcm9maWxlJyksIHRva2VuXG4gICAgcmV0dXJuXG4gIHJldHVyblxuXG5cbkZyYW5jaGluby5ydW4gKCRzdGF0ZSkgLT5cbiAgJHN0YXRlLmdvKCdhcHAuaG9tZScpXG5cbkZyYW5jaGluby5ydW4gKCRyb290U2NvcGUsIGNvcHkpIC0+XG4gICRyb290U2NvcGUuY29weSA9IGNvcHlcblxuRnJhbmNoaW5vLmZhY3RvcnkgJ1NvY2tldCcsIChzb2NrZXRGYWN0b3J5KSAtPlxuICBzb2NrZXRGYWN0b3J5KClcblxuRnJhbmNoaW5vLmZhY3RvcnkgJ0RvY3MnLCAoU29ja2V0KSAtPlxuICBzZXJ2aWNlID1cbiAgICBsaXN0OiBbXVxuICAgIGZpbmQ6IChwZXJtYWxpbmspIC0+XG4gICAgICBfLmZpbmQgc2VydmljZS5saXN0LCAoZG9jKSAtPlxuICAgICAgICBkb2MucGVybWFsaW5rID09IHBlcm1hbGlua1xuXG4gIFNvY2tldC5vbiAnZG9jcycsIChkb2NzKSAtPlxuICAgIHNlcnZpY2UubGlzdCA9IGRvY3NcblxuICBzZXJ2aWNlXG5cbkZyYW5jaGluby5jb250cm9sbGVyICdIb21lQ3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdDb250YWN0U2hlZXRDdHJsJywgKCRzY29wZSwgJGlvbmljQWN0aW9uU2hlZXQpIC0+XG4gICRzY29wZS5zaG93QWN0aW9uc2hlZXQgPSAtPlxuICAgICRpb25pY0FjdGlvblNoZWV0LnNob3dcbiAgICAgIHRpdGxlVGV4dDogXCJDb250YWN0IEZyYW5jaGlub1wiXG4gICAgICBidXR0b25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiBcIkdpdGh1YiA8aSBjbGFzcz1cXFwiaWNvbiBpb24tc2hhcmVcXFwiPjwvaT5cIlxuICAgICAgICB9XG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiBcIkVtYWlsIE1lIDxpIGNsYXNzPVxcXCJpY29uIGlvbi1lbWFpbFxcXCI+PC9pPlwiXG4gICAgICAgIH1cbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6IFwiVHdpdHRlciA8aSBjbGFzcz1cXFwiaWNvbiBpb24tc29jaWFsLXR3aXR0ZXJcXFwiPjwvaT5cIlxuICAgICAgICB9XG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiBcIjIyNC0yNDEtOTE4OSA8aSBjbGFzcz1cXFwiaWNvbiBpb24taW9zLXRlbGVwaG9uZVxcXCI+PC9pPlwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICAgIGNhbmNlbFRleHQ6IFwiQ2FuY2VsXCJcbiAgICAgIGNhbmNlbDogLT5cbiAgICAgICAgY29uc29sZS5sb2cgXCJDQU5DRUxMRURcIlxuICAgICAgICByZXR1cm5cblxuICAgICAgYnV0dG9uQ2xpY2tlZDogKGluZGV4KSAtPlxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiMjI0LTI0MS05MTg5XCIgIGlmIGluZGV4IGlzIDJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcImh0dHA6Ly90d2l0dGVyLmNvbS9mcmFuY2hpbm9fY2hlXCIgIGlmIGluZGV4IGlzIDJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIm1haWx0bzpmcmFuY2hpbm8ubm9uY2VAZ21haWwuY29tXCIgIGlmIGluZGV4IGlzIDFcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcImh0dHA6Ly9naXRodWIuY29tL2ZyYW5ndWNjXCIgIGlmIGluZGV4IGlzIDBcbiAgICAgICAgdHJ1ZVxuXG4gIHJldHVyblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgXCJTbGlkZXNUYXBPbmVDdHJsXCIsICgkc2NvcGUpIC0+XG4gICRzY29wZS5kYXRlID0gJ05PVkVNQkVSIDIwMTQnXG4gICRzY29wZS50aXRsZSA9ICdUYXBjZW50aXZlIG1hbmFnZXIgVVggb3ZlcmhhdWwgYW5kIGZyb250LWVuZCdcbiAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJUYXBjZW50aXZlLmNvbSBVWCBvdmVyaGF1bCBhbmQgU1BBIGZyb250LWVuZFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9naWYvcmVwb3J0LmdpZlwiLFxuICAgICAgXCJ0ZXh0XCIgOiBcIjxwPlN0dWR5IHRoZSB1c2VyIGFuZCB0aGVpciBnb2FscyBhbmQgb3ZlcmhhdWwgdGhlIGV4cGVyaWVuY2Ugd2hpbGUgcmUtd3JpdGluZyB0aGUgZnJvbnQtZW5kIGluIEFuZ3VsYXIuPC9wPjxhIGhyZWY9J2h0dHA6Ly90YXBjZW50aXZlLmNvbScgdGFyZ2V0PSdfYmxhbmsnPlZpc2l0IFdlYnNpdGU8L2E+XCJcbiAgICB9XG4gIF1cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgXCJTbGlkZXNUYXBUd29DdHJsXCIsICgkc2NvcGUpIC0+XG4gICRzY29wZS5kYXRlID0gJ09DVE9CRVIgMjAxNCdcbiAgJHNjb3BlLnRpdGxlID0gJ0Rlc2t0b3AgYW5kIG1vYmlsZSB3ZWIgZnJpZW5kbHkgbWFya2V0aW5nIHdlYnNpdGUnXG4gICRzY29wZS5pbWFnZXMgPSBbXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm8tdGFwY2VudGl2ZS15ZWxsb3cuanBnXCIsXG4gICAgICBcInRleHRcIiA6IFwiPHA+Q3JlYXRlIGEga25vY2tvdXQgYnJhbmQgc3RyYXRlZ3kgd2l0aCBhbiBhd2Vzb21lIGxvb2sgYW5kIGZlZWwuIE1ha2UgYSBzb3BoaXN0aWNhdGVkIG9mZmVyaW5nIGxvb2sgc2ltcGxlIGFuZCBlYXN5IHRvIHVzZS48L3A+PGEgaHJlZj0naHR0cDovL3RhcGNlbnRpdmUuY29tJyB0YXJnZXQ9J19ibGFuayc+VmlzaXQgV2Vic2l0ZTwvYT5cIlxuICAgIH1cblxuICBdXG5cbkZyYW5jaGluby5jb250cm9sbGVyIFwiU2xpZGVzQ3BnQ3RybFwiLCAoJHNjb3BlKSAtPlxuICAkc2NvcGUuZGF0ZSA9ICdKVUxZIDIwMTQnXG4gICRzY29wZS50aXRsZSA9ICdJZGVudGl0eSwgZnVsbC1zdGFjayBNVlAsIGFuZCBtYXJrZXRpbmcgd2Vic2l0ZSBmb3IgYSBuZXcgQ1BHIGVEaXN0cmlidXRpb24gY29tcGFueSdcbiAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaW5vX2NwZ2lvLmpwZ1wiLFxuICAgICAgXCJ0ZXh0XCIgOiBcIjxwPlR1cm4gYW4gb2xkIHNjaG9vbCBDUEcgYnVzaW5lc3MgaW50byBhIHNvcGhpc3RpY2F0ZWQgdGVjaG5vbG9neSBjb21wYW55LiBEZXNpZ24gc2VjdXJlLCBhdXRvbWF0ZWQgYW5kIHRyYW5zZm9ybWF0aXZlIHBsYXRmb3JtLCB0ZWNobmljYWwgYXJjaGl0ZWN0dXJlIGFuZCBleGVjdXRlIGFuIE1WUCBlbm91Z2ggdG8gYXF1aXJlIGZpcnN0IGN1c3RvbWVycy4gTWlzc2lvbiBhY2NvbXBsaXNoZWQuPC9wPjxhIGhyZWY9J2h0dHA6Ly9jcGcuaW8nIHRhcmdldD0nX2JsYW5rJz5WaXNpdCBXZWJzaXRlPC9hPlwiXG4gICAgfVxuICBdXG5cbkZyYW5jaGluby5jb250cm9sbGVyIFwiU2xpZGVzTWVkeWNhdGlvbkN0cmxcIiwgKCRzY29wZSkgLT5cbiAgJHNjb3BlLmRhdGUgPSAnQVBSSUwgMjAxNCdcbiAgJHNjb3BlLnRpdGxlID0gJ1VzZXIgZXhwZXJpZW5jZSBkZXNpZ24gYW5kIHJhcGlkIHByb3RvdHlwaW5nIGZvciBNZWR5Y2F0aW9uLCBhIG5ldyBoZWFsdGhjYXJlIHByaWNlIGNvbXBhcmlzb24gd2Vic2l0ZSdcbiAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1tZWR5Y2F0aW9uLmpwZ1wiLFxuICAgICAgXCJ0ZXh0XCIgOiBcIjxwPldhbHR6IHVwIGluIHRoZSBvbmxpbmUgaGVhbHRoY2FyZSBpbmR1c3RyeSBndW5zIGJsYXppbmcgd2l0aCBraWxsZXIgZGVzaWduIGFuZCBpbnN0aW5jdHMuIEdldCB0aGlzIG5ldyBjb21wYW55IG9mZiB0aGUgZ3JvdW5kIHdpdGggaXQncyBNVlAuIFN3aXBlIGZvciBtb3JlIHZpZXdzLjwvcD48YSBocmVmPSdodHRwOi8vbWVkeWNhdGlvbi5jb20nIHRhcmdldD0nX2JsYW5rJz5WaXNpdCBXZWJzaXRlPC9hPlwiXG4gICAgfSxcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1tZWR5Y2F0aW9uMi5qcGdcIixcbiAgICAgIFwidGV4dFwiIDogXCJcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm8tbWVkeWNhdGlvbjMuanBnXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLW1lZHljYXRpb240LmpwZ1wiXG4gICAgfSxcbiAgXVxuXG5GcmFuY2hpbm8uY29udHJvbGxlciBcIlNsaWRlc0NTVEN0cmxcIiwgKCRzY29wZSkgLT5cbiAgJHNjb3BlLmRhdGUgPSAnQVBSSUwgMjAxNCdcbiAgJHNjb3BlLnRpdGxlID0gJ0Rlc2lnbmVkIGFuZCBkZXZlbG9wZWQgYSBuZXcgdmVyc2lvbiBvZiB0aGUgQ2hpY2FnbyBTdW4gVGltZXMgdXNpbmcgYSBoeWJyaWQgSW9uaWMvQW5ndWxhciBzdGFjaydcbiAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1jc3QuanBnXCIsXG4gICAgICBcInRleHRcIiA6IFwiPHA+SGVscCB0aGUgc3RydWdnbGluZyBtZWRpYSBnaWFudCB1cGdyYWRlIHRoZWlyIGNvbnN1bWVyIGZhY2luZyB0ZWNobm9sb2d5LiBDcmVhdGUgb25lIGNvZGUgYmFzZSBpbiBBbmd1bGFyIGNhcGFibGUgb2YgZ2VuZXJhdGluZyBraWNrLWFzcyBleHBlcmllbmNlcyBmb3IgbW9iaWxlLCB0YWJsZXQsIHdlYiBhbmQgVFYuXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLWNzdDIuanBnXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLWNzdDMuanBnXCJcbiAgICB9LFxuICBdXG5cbkZyYW5jaGluby5jb250cm9sbGVyIFwiU2xpZGVzS291cG5DdHJsXCIsICgkc2NvcGUpIC0+XG4gICRzY29wZS5kYXRlID0gJ01BUkNIIDIwMTQnXG4gICRzY29wZS50aXRsZSA9ICdCcmFuZCByZWZyZXNoLCBtYXJrZXRpbmcgc2l0ZSBhbmQgcGxhdGZvcm0gZXhwZXJpZW5jZSBvdmVyaGF1bCdcbiAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1rb3VwbjEuanBnXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLWtvdXBuMi5qcGdcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm8ta291cG4uanBnXCJcbiAgICB9LFxuICBdXG5cbkZyYW5jaGluby5jb250cm9sbGVyIFwiU2xpZGVzVHJvdW5kQ3RybFwiLCAoJHNjb3BlKSAtPlxuICAkc2NvcGUuZGF0ZSA9ICdBVUdVU1QgMjAxMydcbiAgJHNjb3BlLnRpdGxlID0gJ1NvY2lhbCB0cmF2ZWwgbW9iaWxlIGFwcCBkZXNpZ24sIFVYIGFuZCByYXBpZCBwcm90b3R5cGluZydcbiAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaW5vX3Ryb3VuZC5qcGdcIixcbiAgICAgIFwidGV4dFwiIDogXCJEZXNpZ24gYW4gSW5zdGFncmFtIGJhc2VkIHNvY2lhbCB0cmF2ZWwgYXBwLiBXaHk/IEkgZG9uJ3Qga25vdy5cIlxuICAgIH1cbiAgXVxuXG5GcmFuY2hpbm8uY29udHJvbGxlciBcIlNsaWRlc01vbnRobHlzQ3RybFwiLCAoJHNjb3BlKSAtPlxuICAkc2NvcGUuZGF0ZSA9ICdGRUJSVUFSWSAyMDEzJ1xuICAkc2NvcGUudGl0bGUgPSAnQ3VzdG9tZXIgcG9ydGFsIHBsYXRmb3JtIFVYIGRlc2lnbiBhbmQgZnJvbnQtZW5kJ1xuICAkc2NvcGUuaW1hZ2VzID0gW1xuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLW1vbnRobHlzLWJpejIuanBnXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vX21vbnRobHlzLmpwZ1wiXG4gICAgfVxuICBdXG5cbkZyYW5jaGluby5jb250cm9sbGVyIFwiU2xpZGVzTW9udGhseXNUd29DdHJsXCIsICgkc2NvcGUpIC0+XG4gICRzY29wZS5kYXRlID0gJ01BUkNIIDIwMTInXG4gICRzY29wZS50aXRsZSA9ICdFbnRyZXByZW5ldXIgaW4gcmVzaWRlbmNlIGF0IExpZ2h0YmFuaydcbiAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1tb250aGx5czcuanBnXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLW1vbnRobHlzNS5qcGdcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm8tbW9udGhseXMyLmpwZ1wiXG4gICAgfVxuICBdXG5cbkZyYW5jaGluby5jb250cm9sbGVyIFwiQmxvZ0N0cmxcIiwgKCRzY29wZSkgLT5cblxuICAkc2NvcGUuYXJ0aWNsZXMgPSBbXG4gICAge1xuICAgICAgXCJkYXRlXCIgOiBcIlBvc3RlZCBieSBGcmFuY2hpbm8gb24gRGVjZW1iZXIgMTIsIDIwMTRcIixcbiAgICAgIFwiaGVhZGluZ1wiIDogXCJNeSBwYXRoIHRvIGxlYXJuaW5nIFN3aWZ0XCIsXG4gICAgICBcImF1dGhvcmltZ1wiIDogXCIvaW1nL2ZyYW5rLnBuZ1wiLFxuICAgICAgXCJpbWdcIiA6IFwiL2ltZy9kZWMvbmV3c2xldHRlci1zd2lmdHJpcy1oZWFkZXIuZ2lmXCIsXG4gICAgICBcImJsb2JcIiA6IFwiSSd2ZSBiZWVuIGFuIE1WQyBkZXZlbG9wZXIgaW4gZXZlcnkgbGFuZ3VhZ2UgZXhjZXB0IGZvciBpT1MuIFRoaXMgcGFzdCBPY3RvYmVyLCBJIHRvb2sgbXkgZmlyc3QgcmVhbCBkZWVwIGRpdmUgaW50byBpT1MgcHJvZ3JhbW1pbmcgYW5kIHN0YXJ0ZWQgd2l0aCBTd2lmdC4gVGhlcmUgYXJlIHR3byBncmVhdCB0dXRvcmlhbHMgb3V0IHRoZXJlLiBUaGUgZmlyc3QgaXMgZnJvbSBibG9jLmlvIGFuZCBpcyBmcmVlLiBJdCdzIGEgZ2FtZSwgU3dpZnRyaXMsIHNvIGdldCByZWFkeSBmb3Igc29tZSBhY3Rpb24uIFRoZSBzZWNvbmQgd2lsbCBoZWxwIHlvdSBidWlsZCBzb21ldGhpbmcgbW9yZSBhcHBpc2gsIGl0J3MgYnkgQXBwY29kYS4gR290IHRoZWlyIGJvb2sgYW5kIHdpbGwgYmUgZG9uZSB3aXRoIGl0IHRoaXMgd2Vlay4gU28gZmFyLCBib29rcyBvaywgYnV0IGl0IG1vdmVzIHJlYWxseSBzbG93LlwiLFxuICAgICAgXCJyZXNvdXJjZTFcIiA6IFwiaHR0cHM6Ly93d3cuYmxvYy5pby9zd2lmdHJpcy1idWlsZC15b3VyLWZpcnN0LWlvcy1nYW1lLXdpdGgtc3dpZnRcIixcbiAgICAgIFwicmVzb3VyY2UyXCIgOiBcImh0dHA6Ly93d3cuYXBwY29kYS5jb20vc3dpZnQvXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZGF0ZVwiIDogXCJQb3N0ZWQgYnkgRnJhbmNoaW5vIG9uIERlY2VtYmVyIDExLCAyMDE0XCIsXG4gICAgICBcImhlYWRpbmdcIiA6IFwiV2h5IEkgZ2V0IGdvb3NlIGJ1bXBzIHdoZW4geW91IHRhbGsgYWJvdXQgYXV0b21hdGVkIGVtYWlsIG1hcmtldGluZyBhbmQgc2VnbWVudGF0aW9uIGFuZCBjdXN0b21lci5pbyBhbmQgdGhpbmdzIGxpa2UgdGhhdC5cIixcbiAgICAgIFwiYXV0aG9yaW1nXCIgOiBcIi9pbWcvZnJhbmsucG5nXCIsXG4gICAgICBcImltZ1wiIDogXCIvaW1nL2RlYy9wcmVwZW1haWxzLnBuZ1wiLFxuICAgICAgXCJibG9iXCIgOiBcIkkgZ2V0IHRlYXJ5IGV5ZWQgd2hlbiBJIHRhbGsgYWJvdXQgbXkgd29yayBhdCBCZW5jaFByZXAuY29tLiBJbiBzaG9ydCwgSSB3YXMgdGhlIGZpcnN0IGVtcGxveWVlIGFuZCBoZWxwZWQgdGhlIGNvbXBhbnkgZ2V0IHRvIHRoZWlyIHNlcmllcyBCIG5lYXIgdGhlIGVuZCBvZiB5ZWFyIHR3by4gSSBnb3QgYSBsb3QgZG9uZSB0aGVyZSwgYW5kIG9uZSBvZiB0aGUgdGhpbmdzIEkgcmVhbGx5IGVuam95ZWQgd2FzIGJ1aWxkaW5nIG91dCB0ZWNobm9sb2d5IHRvIHNlZ21lbnQgbGVhZHMsIGJyaW5nIGRpZmZlcmVudCB1c2VycyBkb3duIGRpZmZlcmVudCBjb21tdW5pY2F0aW9uIHBhdGhzIGFuZCBob3cgSSBtYXBwZWQgb3V0IHRoZSBlbnRpcmUgc3lzdGVtIHVzaW5nIGNvbXBsZXggZGlhZ3JhbXMgYW5kIHdvcmtmbG93cy4gU29tZSBvZiB0aGUgdG9vbHMgd2VyZSBidWlsdCBhbmQgYmFzZWQgb24gcXVlcyBsaWtlIFJlZGlzIG9yIFJlc3F1ZSwgb3RoZXJzIHdlIGJ1aWx0IGludG8gRXhhY3RUYXJnZXQgYW5kIEN1c3RvbWVyLmlvLiBJbiB0aGUgZW5kLCBJIGJlY2FtZSBzb21ld2hhdCBvZiBhbiBleHBlcnQgYXQgbW9uZXRpemluZyBlbWFpbHMuIFdpdGhpbiBvdXIgZW1haWwgbWFya2V0aW5nIGNoYW5uZWwsIHdlIGV4cGxvcmVkIHRhZ2dpbmcgdXNlcnMgYmFzZWQgb24gdGhlaXIgYWN0aW9ucywgc3VjaCBhcyBvcGVucyBvciBub24gb3BlbnMsIG9yIHdoYXQgdGhleSBjbGlja2VkIG9uLCB3ZSB0YXJnZWQgZW1haWwgdXNlcnMgd2hvIGhhZCBiZWVuIHRvdWNoZWQgc2V2ZW4gdGltZXMgd2l0aCBzcGVjaWFsIGlycmlzaXRhYmxlIHNhbGVzLCBiZWNhdXNlIHdlIGtub3cgYWZ0ZXIgNiB0b3VjaGVzLCB3ZSBjb3VsZCBjb252ZXJ0LiBUaGVzZSB0cmlja3Mgd2UgbGVhcm5lZCBsZWQgdG8gMjUtMzBrIGRheXMsIGFuZCBldmVudHVhbGx5LCBkYXlzIHdoZXJlIHdlIHNvbGQgMTAwayB3b3J0aCBvZiBzdWJzY3JpcHRpb25zLiBTbywgbXkgcG9pbnQ/IERvbid0IGJlIHN1cnByaXNlZCBpZiBJIGdlZWsgb3V0IGFuZCBmYWludCB3aGVuIEkgaGVhciB5b3UgdGFsayBhYm91dCB0cmFuc2FjdGlvbmFsIGVtYWlsaW5nIGFuZCBjYWRlbmNlcyBhbmQgY29uc3VtZXIgam91cm5pZXMgYW5kIHN0dWZmIGxpa2UgdGhhdC5cIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJkYXRlXCIgOiBcIlBvc3RlZCBieSBGcmFuY2hpbm8gb24gRGVjZW1iZXIgMTAsIDIwMTRcIixcbiAgICAgIFwiaGVhZGluZ1wiIDogXCJJZiBJIGNvdWxkIGhhdmUgb25lIHdpc2g7IEkgZ2V0IHRvIHVzZSB0aGlzIG1ldGhvZCB3aGVuIGRlc2lnbmluZyB5b3VyIGNvbnN1bWVyIGpvdXJuZXkgZnVubmVsLlwiLFxuICAgICAgXCJhdXRob3JpbWdcIiA6IFwiL2ltZy9mcmFuay5wbmdcIixcbiAgICAgIFwiaW1nXCIgOiBcIi9pbWcvZGVjL3V4X2JvYXJkLmpwZ1wiLFxuICAgICAgXCJibG9iXCIgOiBcIlNvIGFmdGVyIGEgYnVuY2ggb2YgZXRobm9ncmFwaGljIHN0dWRpZXMgZnJvbSBwZXJzb25hIG1hdGNoZXMgSSBnYXRoZXIgaW4tcGVyc29uLCBJIGdldCB0byBmaWxsIGEgd2FsbCB1cCB3aXRoIGtleSB0aGluZ3MgcGVvcGxlIHNhaWQsIGZlbHQsIGhlYXJkIC0gbW90aXZhdG9ycywgYmFycmllcnMsIHF1ZXN0aW9ucywgYXR0aXR1ZGVzIGFuZCBzdWNoLiBJIHRoZW4gZ3JvdXAgdGhlc2UgcG9zdC1pdCB0aG91Z2h0cyBpbiB2YXJpb3VzIHdheXMsIGxvb2tpbmcgZm9yIHBhdHRlcm5zLCBzZW50aW1lbnQsIG5ldyBpZGVhcy4gSSB0aGVuIHRha2UgdGhpcyByaWNoIGRhdGEgYW5kIGRldmVsb3AgYSB3aGF0IGNvdWxkIGJlIGJyYW5kaW5nLCBhIGxhbmRpbmcgcGFnZSBvciBhbiBlbWFpbCAtIHdpdGggd2hhdCBJIGNhbGwsIGFuIGludmVydGVkIHB5cmFtaWQgYXBwcm9hY2ggdG8gY29udGVudCwgd2hlcmUgYWRkcmVzc2luZyB0aGUgbW9zdCBpbXBvcnRhbnQgdGhpbmdzIGZvdW5kIGluIHRoZSB1c2VyIHJlc2VhcmNoIGdldCBhZGRyZXNzZWQgaW4gYSBoZXJpYXJjaGljYWwgb3JkZXIuIEkgY3JlYXRlIDUtNiBpdGVyYXRpb25zIG9mIHRoZSBsYW5kaW5nIHBhZ2UgYW5kIHJlLXJ1biB0aGVtIHRocm91Z2ggYSBzZWNvbmQgZ3JvdXAgb2YgcGFydGljaXBhbnRzLCBzdGFrZWhvbGRlcnMgYW5kIGZyaWVuZHMuIEkgdGhlbiB0YWtlIGV2ZW4gbW9yZSBub3RlcyBvbiBwZW9wbGVzIHNwZWFrLWFsb3VkIHJlYWN0aW9ucyB0byB0aGUgbGFuZGluZyBwYWdlcy4gQWZ0ZXIgdGhpcywgSSdtIHJlYWR5IHRvIGRlc2lnbiB0aGUgZmluYWwgY29weSBhbmQgcGFnZXMgZm9yIHlvdXIgZnVubmVsLlwiXG4gICAgfSxcbiAgICB7XG4gICAgICBcImRhdGVcIiA6IFwiUG9zdGVkIGJ5IEZyYW5jaGlubyBvbiBEZWNlbWJlciA5LCAyMDE0XCIsXG4gICAgICBcImhlYWRpbmdcIiA6IFwiRGlkIEkgZXZlbiBiZWxvbmcgaGVyZT9cIixcbiAgICAgIFwiYXV0aG9yaW1nXCIgOiBcIi9pbWcvZnJhbmsucG5nXCIsXG4gICAgICBcImltZ1wiIDogXCIvaW1nL2RlYy91Y2xhLmpwZ1wiLFxuICAgICAgXCJibG9iXCIgOiBcIlRoaXMgY29taW5nIHdlZWtlbmQgdGhlcmUncyBwcm9iYWJseSBhIGhhY2thdGhvbiBnb2luZyBvbiBpbiB5b3VyIGNpdHkuIFNvbWUgb2YgdGhlbSBhcmUgZ2V0dGluZyByZWFsbHkgYmlnLiBJIHdhc24ndCByZWdpc3RlcmVkIGZvciBMQSBIYWNrcyB0aGlzIHN1bW1lci4gSSBkb24ndCBldmVuIGtub3cgaG93IEkgZW5kZWQgdXAgdGhlcmUgb24gYSBGcmlkYXkgbmlnaHQsIGJ1dCB3aGVuIEkgc2F3IHdoYXQgd2FzIGdvaW5nIG9uLCBJIGdyYWJiZWQgYSBjaGFpciBhbmQgc3RhcnRlZCBoYWNraW5nIGF3YXkuIFdvcnJpZWQgSSBoYWQganVzdCBzbnVjayBpbiB0aGUgYmFjayBkb29yIGFuZCBzdGFydGVkIGNvbXBldGluZywgbXkgcmlkZSBsZWZ0IGFuZCB0aGVyZSBJIHdhcywgZm9yIHRoZSBuZXh0IHR3byBkYXlzLiBUaGF0J3MgcmlnaHQuIEkgc251Y2sgaW4gdGhlIGJhY2sgb2YgTEEgSGFja3MgbGFzdCBzdW1tZXIgYXQgVUNMQSBhbmQgaGFja2VkIHdpdGgga2lkcyAxMCB5ZWFycyB5b3VuZ2VyIHRoYW4gbWUuIEkgY291bGRuJ3QgbWlzcyBpdC4gSSB3YXMgZmxvb3JlZCB3aGVuIEkgc2F3IGhvdyBtYW55IHBlb3BsZSB3ZXJlIGluIGl0LiBNZSwgYmVpbmcgdGhlIG1pc2NoZXZpb3VzIGhhY2tlciBJIGFtLCBJIHRob3VnaHQgaWYgSSB1c2VkIHRoZSBlbmVyZ3kgb2YgdGhlIGVudmlyb25tZW50IHRvIG15IGFkdmFudGFnZSwgSSBjb3VsZCBidWlsZCBzb21ldGhpbmcgY29vbC4gTG9uZyBzdG9yeSBzaG9ydCwgbGV0IG1lIGp1c3Qgc2F5LCB0aGF0IGlmIHlvdSBoYXZlIGJlZW4gaGF2aW5nIGEgaGFyZCB0aW1lIGxhdW5jaGluZywgc2lnbiB1cCBmb3IgYSBoYWNrYXRob24uIEl0J3MgYSBndWFyYW50ZWVkIHdheSB0byBvdmVyLWNvbXBlbnNhdGUgZm9yIHlvdXIgY29uc3RhbnQgZmFpbHVyZSB0byBsYXVuY2guIE1vcmUgb24gd2hhdCBoYXBwZW5lZCB3aGVuIEkgdG9vayB0aGUgc3RhZ2UgYnkgc3VycHJpc2UgYW5kIGdvdCBib290ZWQgbGF0ZXIuLi5cIlxuICAgIH1cbiAgXVxuXG5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0Fib3V0Q3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdBcHBDdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ1Jlc3VtZUN0cmwnLCAoJHNjb3BlKSAtPlxuICAkc2NvcGUuYmxvYiA9ICc8ZGl2IGNsYXNzPVwicm93XCI+PGRpdiBjbGFzcz1cImxhcmdlLTEyXCI+PGRpdiBjbGFzcz1cInJvd1wiPjxkaXYgY2xhc3M9XCJsYXJnZS0xMiBjb2x1bW5zXCI+PGg2Pk5PViAyMDEzIC0gUFJFU0VOVDwvaDY+PGJyLz48aDI+SHlicmlkIEV4cGVyaWVuY2UgRGVzaWduZXIvRGV2ZWxvcGVyLCBJbmRlcGVuZGVudDwvaDI+PGJyLz48cD5Xb3JrZWQgd2l0aCBub3RlYWJsZSBlbnRyZXByZW5vdXJzIG9uIHNldmVyYWwgbmV3IHByb2R1Y3QgYW5kIGJ1c2luZXNzIGxhdW5jaGVzLiBIZWxkIG51bWVyb3VzIHJvbGVzLCBpbmNsdWRpbmcgY29udGVudCBzdHJhdGVnaXN0LCB1c2VyIHJlc2VhcmNoZXIsIGRlc2lnbmVyIGFuZCBkZXZlbG9wZXIuIDwvcD48cD48c3Ryb25nPkNvbXBhbmllczwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJub1wiPjxsaT48YSBocmVmPVwiaHR0cDovL3RhcGNlbnRpdmUuY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+VGFwY2VudGl2ZTwvYT48L2xpPjxsaT48YSBocmVmPVwiaHR0cDovL2NwZy5pb1wiIHRhcmdldD1cIl9ibGFua1wiPkNQR2lvPC9hPjwvbGk+PGxpPjxhIGhyZWY9XCJodHRwOi8va291LnBuL1wiPktvdS5wbiBNZWRpYTwvYT48L2xpPjxsaT4gPGEgaHJlZj1cImh0dHA6Ly9tZWR5Y2F0aW9uLmNvbVwiIHRhcmdldD1cIl9ibGFua1wiPk1lZHljYXRpb248L2E+PC9saT48bGk+IDxhIGhyZWY9XCJodHRwOi8vd3d3LnN1bnRpbWVzLmNvbS9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5DaGljYWdvIFN1biBUaW1lczwvYT48L2xpPjwvdWw+PGJyLz48cD48c3Ryb25nPlRhcGNlbnRpdmUgRGVsaXZlcmFibGVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHNcIj48bGk+Q29tcGxldGUgVGFwY2VudGl2ZS5jb20gbWFya2V0aW5nIHdlYnNpdGUgYW5kIFVYIG92ZXJoYXVsIG9mIGNvcmUgcHJvZHVjdCwgdGhlIFwiVGFwY2VudGl2ZSBNYW5hZ2VyXCI8L2xpPjxsaT5JbmR1c3RyaWFsIGRlc2lnbiBvZiB0aGUgVGFwY2VudGl2ZSBUb3VjaHBvaW50PC9saT48bGk+Q29udGVudCBzdHJhdGVneSBmb3IgY29ycG9yYXRlIG1hcmtldGluZyBzaXRlPC9saT48bGk+TW9iaWxlIGZpcnN0IG1hcmtldGluZyB3ZWJzaXRlIHVzaW5nIElvbmljIGFuZCBBbmd1bGFyPC9saT48L3VsPjxwPjxzdHJvbmc+Q1BHaW8gRGVsaXZlcmFibGVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHNcIj48bGk+UHJvZHVjdCBhbmQgYnVzaW5lc3Mgc3RyYXRlZ3ksIHRlY2huaWNhbCBhcmNoaXRlY3R1cmUgYW5kIHNwZWNpZmljYXRpb24gZGVzaWduPC9saT48bGk+T25lIGh1bmRyZWQgcGFnZSBwcm9wb3NhbCB0ZW1wbGF0ZSBvbiBidXNpbmVzcyBtb2RlbCBhbmQgY29ycG9yYXRlIGNhcGFiaWxpdGllczwvbGk+PGxpPk1hcmtldGluZyB3ZWJzaXRlIGRlc2lnbiBhbmQgY29udGVudCBzdHJhdGVneTwvbGk+PGxpPkNvcmUgcHJvZHVjdCBkZXNpZ24gYW5kIE1WUCBmdW5jdGlvbmFsIHByb3RvdHlwZTwvbGk+PC91bD48cD48c3Ryb25nPktvdS5wbiBEZWxpdmVyYWJsZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5Lb3UucG4gTWVkaWEgYnJhbmQgcmVmcmVzaDwvbGk+PGxpPk1hcmtldGluZyBzaXRlIHJlZGVzaWduPC9saT48bGk+UG9ydGFsIHVzZXIgZXhwZXJpZW5jZSBvdmVyaGF1bDwvbGk+PC91bD48cD48c3Ryb25nPk1lZHljYXRpb24gRGVsaXZlcmFibGVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHNcIj48bGk+Q29uY2VwdHVhbCBkZXNpZ24gYW5kIGFydCBkaXJlY3Rpb248L2xpPjxsaT5Vc2VyIHJlc2VhcmNoPC9saT48bGk+UmFwaWQgcHJvdG90eXBlczwvbGk+PC91bD48cD48c3Ryb25nPkNoaWNhZ28gU3VuIFRpbWVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHNcIj48bGk+Q29uY2VwdHVhbCBkZXNpZ24gYW5kIGFydCBkaXJlY3Rpb248L2xpPjxsaT5OYXRpdmUgaU9TIGFuZCBBbmRyb2lkIGFwcCBkZXNpZ24gYW5kIGp1bmlvciBkZXZlbG9wbWVudDwvbGk+PGxpPkh5YnJpZCBJb25pYy9Bbmd1bGFyIGRldmVsb3BtZW50PC9saT48L3VsPjwvZGl2PjwvZGl2Pjxici8+PGRpdiBjbGFzcz1cInJvd1wiPjxkaXYgY2xhc3M9XCJsYXJnZS0xMiBjb2x1bW5zXCI+PGg2Pk1BUkNIIDIwMTAgLSBPQ1RPQkVSIDIwMTM8L2g2Pjxici8+PGgyPkRpcmVjdG9yIG9mIFVzZXIgRXhwZXJpZW5jZSwgTGlnaHRiYW5rPC9oMj48YnIvPjxwPkxhdW5jaGVkIGFuZCBzdXBwb3J0ZWQgbXVsdGlwbGUgbmV3IGNvbXBhbmllcyB3aXRoaW4gdGhlIExpZ2h0YmFuayBwb3J0Zm9saW8uIDwvcD48cD48c3Ryb25nPkNvbXBhbmllczwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJub1wiPjxsaT4gPGEgaHJlZj1cImh0dHA6Ly9jaGljYWdvaWRlYXMuY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+Q2hpY2Fnb0lkZWFzLmNvbTwvYT48L2xpPjxsaT4gPGEgaHJlZj1cImh0dHA6Ly9iZW5jaHByZXAuY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+QmVuY2hQcmVwLmNvbTwvYT48L2xpPjxsaT4gPGEgaHJlZj1cImh0dHA6Ly9zbmFwc2hlZXRhcHAuY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+U25hcFNoZWV0QXBwLmNvbTwvYT48L2xpPjxsaT5Nb250aGx5cy5jb20gKGRlZnVuY3QpPC9saT48bGk+IDxhIGhyZWY9XCJodHRwOi8vZG91Z2guY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RG91Z2guY29tPC9hPjwvbGk+PGxpPiA8YSBocmVmPVwiaHR0cDovL2dyb3Vwb24uY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+R3JvdXBvbi5jb208L2E+PC9saT48L3VsPjxici8+PHA+PHN0cm9uZz5DaGljYWdvIElkZWFzIERlbGl2ZXJhYmxlczwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJidWxsZXRzXCI+PGxpPldlYnNpdGUgZGVzaWduIHJlZnJlc2gsIGFydCBkaXJlY3Rpb248L2xpPjxsaT5DdXN0b20gdGlja2V0IHB1cmNoYXNpbmcgcGxhdGZvcm0gVVggcmVzZWFyY2ggJmFtcDsgZGVzaWduPC9saT48bGk+UnVieSBvbiBSYWlscyBkZXZlbG9wbWVudCwgbWFpbnRlbmVuY2U8L2xpPjxsaT5HcmFwaGljIGRlc2lnbiBzdXBwb3J0PC9saT48bGk+QW5udWFsIHJlcG9ydCBkZXNpZ248L2xpPjwvdWw+PHA+PHN0cm9uZz5CZW5jaFByZXAuY29tIERlbGl2ZXJhYmxlczwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJidWxsZXRzXCI+PGxpPlJlLWJyYW5kaW5nLCBjb21wbGV0ZSBCZW5jaFByZXAgaWRlbnRpdHkgcGFja2FnZTwvbGk+PGxpPlN1cHBvcnRlZCBjb21wYW55IHdpdGggYWxsIGRlc2lnbiBhbmQgdXggZnJvbSB6ZXJvIHRvIGVpZ2h0IG1pbGxpb24gaW4gZmluYW5jaW5nPC9saT48bGk+TGVhZCBhcnQgYW5kIFVYIGRpcmVjdGlvbiBmb3IgdHdvIHllYXJzPC9saT48bGk+RnJvbnQtZW5kIHVzaW5nIEJhY2tib25lIGFuZCBCb290c3RyYXA8L2xpPjxsaT5Vc2VyIHJlc2VhcmNoLCBldGhub2dyYXBoaWMgc3R1ZGllcywgdXNlciB0ZXN0aW5nPC9saT48bGk+RW1haWwgbWFya2V0aW5nIGNhZGVuY2Ugc3lzdGVtIGRlc2lnbiBhbmQgZXhlY3V0aW9uPC9saT48bGk+U2NyaXB0ZWQsIHN0b3J5Ym9hcmRlZCBhbmQgZXhlY3V0ZWQgYm90aCBhbmltYXRlZCBhbmQgbGl2ZSBtb3Rpb24gZXhwbGFpbmVyIHZpZGVvczwvbGk+PC91bD48cD48c3Ryb25nPlNuYXBTaGVldEFwcC5jb20gRGVsaXZlcmFibGVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHNcIj48bGk+TGFyZ2Ugc2NhbGUgcG9ydGFsIFVYIHJlc2VhcmNoIGFuZCBpbmZvcm1hdGlvbiBhcmNoaXRlY3R1cmU8L2xpPjxsaT5UaHJlZSByb3VuZHMgb2YgcmFwaWQgcHJvdG90eXBpbmcgYW5kIHVzZXIgdGVzdGluZzwvbGk+PGxpPkdyYXBoaWMgZGVzaWduIGFuZCBpbnRlcmFjdGlvbiBkZXNpZ24gZnJhbWV3b3JrPC9saT48bGk+VXNlciB0ZXN0aW5nPC9saT48L3VsPjxwPjxzdHJvbmc+TW9udGhseXMuY29tIERlbGl2ZXJhYmxlczwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJidWxsZXRzXCI+PGxpPklkZW50aXR5IGFuZCBhcnQgZGlyZWN0aW9uPC9saT48bGk+UHJvZHVjdCBzdHJhdGVneSBhbmQgbmV3IGNvbXBhbnkgbGF1bmNoPC9saT48bGk+T25saW5lIG1hcmtldGluZyBzdHJhdGVneSwgaW5jbHVkaW5nIHRyYW5zYWN0aW9uYWwgZW1haWwsIHByb21vdGlvbiBkZXNpZ24gYW5kIGxlYWQgZ2VuZXJhdGlvbjwvbGk+PGxpPlByb2R1Y3QgZXhwZXJpZW5jZSBkZXNpZ24gYW5kIGZyb250LWVuZDwvbGk+PGxpPkNvbnRlbnQgc3RyYXRlZ3k8L2xpPjxsaT5TY3JpcHRlZCwgc3Rvcnlib2FyZGVkIGFuZCBleGVjdXRlZCBib3RoIGFuaW1hdGVkIGFuZCBsaXZlIG1vdGlvbiBleHBsYWluZXIgdmlkZW9zPC9saT48L3VsPjxwPjxzdHJvbmc+RG91Z2guY29tIERlbGl2ZXJhYmxlczwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJidWxsZXRzIGJ1bGxldHNcIj48bGk+Q29uc3VtZXIgam91cm5leSBtYXBwaW5nIGFuZCBldGhub2dyYXBoaWMgc3R1ZGllczwvbGk+PGxpPlJhcGlkIHByb3RvdHlwaW5nLCBjb25jZXB0dWFsIGRlc2lnbjwvbGk+PGxpPk1lc3NhZ2luZyBzdHJhdGVneSwgdXNlciB0ZXN0aW5nPC9saT48L3VsPjxwPjxzdHJvbmc+R3JvdXBvbi5jb20gRGVsaXZlcmFibGVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHNcIj48bGk+RW1lcmdpbmcgbWFya2V0cyByZXNlYXJjaDwvbGk+PGxpPlJhcGlkIGRlc2lnbiBhbmQgcHJvdG90eXBpbmc8L2xpPjxsaT5WaXN1YWwgZGVzaWduIG9uIG5ldyBjb25jZXB0czwvbGk+PGxpPkVtYWlsIHNlZ21lbnRhdGlvbiByZXNlYXJjaDwvbGk+PC91bD48L2Rpdj48L2Rpdj48YnIvPjxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwibGFyZ2UtMTIgY29sdW1uc1wiPjxoNj5OT1ZFTUJFUiAyMDA3IC0gQVBSSUwgMjAxMDwvaDY+PGJyLz48aDI+RGV2ZWxvcGVyICZhbXA7IENvLWZvdW5kZXIsIERpbGx5ZW8uY29tPC9oMj48YnIvPjxwPkNvLWZvdW5kZWQsIGRlc2lnbmVkIGFuZCBkZXZlbG9wZWQgYSBkYWlseSBkZWFsIGVDb21tZXJjZSB3ZWJzaXRlLjwvcD48cD48c3Ryb25nPlJvbGU8L3N0cm9uZz48YnIvPkRlc2lnbmVkLCBkZXZlbG9wZWQgYW5kIGxhdW5jaGVkIGNvbXBhbmllcyBmaXJzdCBjYXJ0IHdpdGggUEhQLiBJdGVyYXRlZCBhbmQgZ3JldyBzaXRlIHRvIG1vcmUgdGhhbiB0d28gaHVuZHJlZCBhbmQgZmlmdHkgdGhvdXNhbmQgc3Vic2NyaWJlcnMgaW4gbGVzcyB0aGFuIG9uZSB5ZWFyLiA8L3A+PHA+PHN0cm9uZz5Ob3RlYWJsZSBTdGF0czwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJidWxsZXRzXCI+PGxpPkJ1aWx0IGEgbGlzdCBvZiAyNTAsMDAwIHN1YnNjcmliZXJzIGluIHRoZSBmaXJzdCB5ZWFyPC9saT48bGk+UGl2b3RlZCBhbmQgdHdlYWtlZCBkZXNpZ24sIGJ1c2luZXNzIGFuZCBhcHByb2FjaCB0byAxMDAwIHRyYW5zYWN0aW9ucyBwZXIgZGFpbHk8L2xpPjxsaT5Tb2xkIGJ1c2luZXNzIGluIERlY2VtYmVyIDIwMDkgdG8gSW5ub3ZhdGl2ZSBDb21tZXJjZSBTb2x1dGlvbnM8L2xpPjwvdWw+PC9kaXY+PC9kaXY+PGJyLz48ZGl2IGNsYXNzPVwicm93XCI+PGRpdiBjbGFzcz1cImxhcmdlLTEyIGNvbHVtbnNcIj48aDY+TUFSQ0ggMjAwNSAtIE9DVE9CRVIgMjAwNzwvaDY+PGJyLz48aDI+U29sdXRpb25zIEFyY2hpdGVjdCAmYW1wOyBTZW5pb3IgRGV2ZWxvcGVyLCA8YSBocmVmPVwiaHR0cDovL3d3dy5tYW5pZmVzdGRpZ2l0YWwuY29tL1wiPk1hbmlmZXN0IERpZ2l0YWw8L2E+PC9oMj48YnIvPjxwPkJ1aWx0IGFuZCBtYW5hZ2VkIG11bHRpcGxlIENhcmVlckJ1aWxkZXIuY29tIG5pY2hlIHNpdGVzIGZvciB0aGUgbGFyZ2VzdCBpbmRlcGVuZGVudCBhZ2VuY3kgaW4gdGhlIG1pZHdlc3QuPC9wPjxwPjxzdHJvbmc+Um9sZTwvc3Ryb25nPjxici8+UmVzZWFyY2ggYW5kIGV4cGxvcmUgZW1lcmdpbmcgdGVjaG5vbG9naWVzLCBpbXBsZW1lbnQgc29sdXRpb25zIGFuZCBtYW5hZ2Ugb3RoZXIgZGV2ZWxvcGVycy4gV29ya2VkIHdpdGggYXNwLm5ldCBvbiBhIGRhaWx5IGJhc2lzIGZvciBhbG1vc3QgdHdvIHllYXJzLiA8L3A+PHA+PHN0cm9uZz5Ob3RlYWJsZSBBY2NvbXBsaXNobWVudHM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5SZWNvZ25pemVkIGZvciBsYXVuY2hpbmcgaGlnaCBxdWFsaXR5IHdlYiBhcHAgZm9yIENhcmVlciBCdWlsZGVyIGluIHJlY29yZCB0aW1lPC9saT48bGk+TWFuYWdlZCBleHRyZW1lIFNFTyBwcm9qZWN0IHdpdGggbW9yZSB0aGFuIDUwMCB0aG91c2FuZCBsaW5rcywgcGFnZXMgYW5kIG92ZXIgOCBtaWxsaW9uIFVHQyBhcnRpZmFjdHM8L2xpPjxsaT5TaGlmdGVkIGFnZW5jaWVzIGRldmVsb3BtZW50IHByYWN0aWNlcyB0byB2YXJpb3VzIG5ldyBjbGllbnQtY2VudHJpYyBBSkFYIG1ldGhvZG9sb2dpZXM8L2xpPjxsaT5NYW5hZ2VkIG11bHRpcGxlIHByb2plY3RzIGNvbmN1cnJlbnRseSwgaW5jbHVkaW5nIGNob29zZWNoaWNhZ28uY29tIGFuZCBicmllZmluZy5jb208L2xpPjwvdWw+PC9kaXY+PC9kaXY+PGJyLz48ZGl2IGNsYXNzPVwicm93XCI+PGRpdiBjbGFzcz1cImxhcmdlLTEyIGNvbHVtbnNcIj48aDY+QVBSSUwgMjAwNCAtIEpBTlVBUlkgMjAwNzwvaDY+PGJyLz48aDI+SnVuaW9yIFBMRCBEZXZlbG9wZXIsICA8YSBocmVmPVwiaHR0cDovL3d3dy5tYW5pZmVzdGRpZ2l0YWwuY29tL1wiPkF2ZW51ZTwvYT48L2gyPjxici8+PHA+RnJvbnQtZW5kIGRldmVsb3BlciBhbmQgVVggZGVzaWduIGludGVybiBmb3IgQXZlbnVlIEEgUmF6b3JmaXNoc1xcJyBsZWdhY3kgY29tcGFueSwgQXZlbnVlLWluYy48L3A+PHA+PHN0cm9uZz5Sb2xlPC9zdHJvbmc+PGJyLz5EZXZlbG9wIGZyb250LWVuZCBmb3IgbXVsdGlwbGUgY2xpZW50IHdlYnNpdGVzLCBpbmNsdWRpbmcgZmxvci5jb20sIGFjaGlldmVtZW50Lm9yZywgY2FueW9ucmFuY2guY29tIGFuZCB0dXJib2NoZWYuPC9wPjxwPjxzdHJvbmc+Tm90ZWFibGUgQWNjb21wbGlzaG1lbnRzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHNcIj48bGk+RXhlY3V0ZWQgZnJvbnQtZW5kIHByb2plY3RzIG9uLXRpbWUgYW5kIHVuZGVyLWJ1ZGdldDwvbGk+PGxpPkFzc2lnbmVkIFVYIGludGVybnNoaXAgcm9sZSwgcmVjb2duaXplZCBieSBkZXNpZ24gdGVhbSBhcyBhIHlvdW5nIHRhbGVudDwvbGk+PGxpPldpcmVmcmFtZWQgY3VzdG9tIHNob3BwaW5nIGNhcnQgcGxhdGZvcm0gZm9yIGZsb3IuY29tPC9saT48bGk+RGV2ZWxvcGVkIGludGVybmFsIFNFTyBwcmFjdGljZTwvbGk+PC91bD48L2Rpdj48L2Rpdj48YnIvPjxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwibGFyZ2UtMTIgY29sdW1uc1wiPjxoNj5KVUxZIDIwMDAgLSBKQU5VQVJZIDIwMDQ8L2g2Pjxici8+PGgyPmVDb21tZXJjZSBEZXZlbG9wZXIsIEF0b3ZhPC9oMj48YnIvPjxwPkdlbmVyYWwgd2ViIGRlc2lnbmVyIGFuZCBkZXZlbG9wZXIgZm9yIGZhbWlseSBvd25lZCBwYWludCBkaXN0cmlidXRpb24gYnVzaW5lc3MuIDwvcD48cD48c3Ryb25nPlJvbGU8L3N0cm9uZz48YnIvPkJ1aWx0IHNldmVyYWwgc2hvcHBpbmcgY2FydHMgaW4gY2xhc3NpYyBBU1AgYW5kIFBIUC4gR3JldyBidXNpbmVzcyB1c2luZyBvbmxpbmUgbWFya2V0aW5nIHN0cmF0ZWdpZXMgdG8gdHdvIG1pbGxpb24gaW4gcmV2ZW51ZS4gPC9wPjxwPjxzdHJvbmc+Tm90ZWFibGUgQWNjb21wbGlzaG1lbnRzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHNcIj48bGk+QmVjYW1lIGZpcnN0IGNvbXBhbnkgdG8gc2hpcCBwYWludHMgYW5kIGNvYXRpbmdzIGFjcm9zcyB0aGUgVW5pdGVkIFN0YXRlczwvbGk+PGxpPkZpcnN0IGVtcGxveWVlLCBkZXZlbG9wZWQgY29tcGFueSB0byAyKyBtaWxsaW9uIGluIHJldmVudWUgd2l0aCBPdmVydHVyZSwgR29vZ2xlIEFkd29yZHMgYW5kIFNFTzwvbGk+PGxpPkNyZWF0ZWQsIG1hcmtldGVkIGFuZCBzdWJzY3JpYmVkIHZvY2F0aW9uYWwgc2Nob29sIGZvciBzcGVjaWFsdHkgY29hdGluZ3M8L2xpPjxsaT5Xb3JrZWQgd2l0aCB0b3AgSXRhbGlhbiBwYWludCBtYW51ZmFjdHVyZXJzIG92ZXJzZWFzIHRvIGJ1aWxkIGV4Y2x1c2l2ZSBkaXN0cmlidXRpb24gcmlnaHRzPC9saT48L3VsPjwvZGl2PjwvZGl2Pjxici8+PGRpdiBjbGFzcz1cInJvd1wiPjxkaXYgY2xhc3M9XCJsYXJnZS0xMiBjb2x1bW5zXCI+PGg2PlNFUFRFTUJFUiAyMDAwIC0gTUFZIDIwMDI8L2g2Pjxici8+PGgyPkVkdWNhdGlvbjwvaDI+PGJyLz48cD5TZWxmIGVkdWNhdGVkIGRlc2lnbmVyL3Byb2dyYW1tZXIgd2l0aCB2b2NhdGlvbmFsIHRyYWluaW5nLiA8L3A+PHA+PHN0cm9uZz5DZXJ0aWZpY2F0aW9uczwvc3Ryb25nPjxici8+aU5FVCssIEErIENlcnRpZmljYXRpb24gPC9wPjxwPjxzdHJvbmc+QXBwcmVudGljZXNoaXA8L3N0cm9uZz48YnIvPlllYXIgbG9uZyBwZXJzb25hbCBhcHByZW50aWNlc2hpcCB3aXRoIGZpcnN0IGVuZ2luZWVyIGF0IEFtYXpvbi5jb208L3A+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+PGJyLz48YnIvPidcblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0pvYlRhcGNlbnRpdmVDdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0pvYlRhcGNlbnRpdmVUd29DdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0pvYkNwZ2lvQ3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdKb2JNZWR5Y2F0aW9uQ3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdKb2JDc3RDdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0pvYktvdXBuQ3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdKb2JNZWR5Y2F0aW9uQ3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdKb2JNZWR5Y2F0aW9uQ3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdKb2JUcm91bmRDdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0pvYk1vbnRobHlzT25lQ3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdKb2JNb250aGx5c1R3b0N0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSm9iQmVuY2hwcmVwQ3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdDb250YWN0Q3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdEZXZlbG9wZXJzQ3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdEZXZlbG9wZXJDZW50ZXJDdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0RvY3NDdHJsJywgKCRzY29wZSwgRG9jcykgLT5cbiAgJHNjb3BlLiR3YXRjaCAoLT4gRG9jcy5saXN0KSwgLT5cbiAgICAkc2NvcGUuZG9jcyA9IERvY3MubGlzdFxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnRG9jQ3RybCcsICgkc2NvcGUsICRzY2UsICRzdGF0ZVBhcmFtcywgJHRpbWVvdXQsIERvY3MpIC0+XG4gICRzY29wZS5pbmRleCA9IGlmICRzdGF0ZVBhcmFtcy5zdGVwIHRoZW4gJHN0YXRlUGFyYW1zLnN0ZXAtMSBlbHNlIDBcblxuICAkc2NvcGUuJHdhdGNoICgtPiBEb2NzLmxpc3QpLCAtPlxuICAgICRzY29wZS5kb2MgPSBEb2NzLmZpbmQoJHN0YXRlUGFyYW1zLnBlcm1hbGluaylcbiAgICBpZiAkc2NvcGUuZG9jXG4gICAgICAkc2NvcGUuc3RlcCA9ICRzY29wZS5kb2Muc3RlcHNbJHNjb3BlLmluZGV4XVxuICAgICAgJHNjb3BlLnN0ZXAudXJsID0gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoJHNjb3BlLnN0ZXAudXJsKVxuXG4gICAgICBpZiAkc2NvcGUuc3RlcC50eXBlID09ICdkaWFsb2cnXG4gICAgICAgICRzY29wZS5tZXNzYWdlSW5kZXggPSAwXG4gICAgICAgICRzY29wZS5tZXNzYWdlcyA9IFtdXG4gICAgICAgICR0aW1lb3V0KCRzY29wZS5uZXh0TWVzc2FnZSwgMTAwMClcblxuICAkc2NvcGUuaGFzTW9yZVN0ZXBzID0gLT5cbiAgICBpZiAkc2NvcGUuc3RlcFxuICAgICAgJHNjb3BlLnN0ZXAuaW5kZXggPCAkc2NvcGUuZG9jLnN0ZXBzLmxlbmd0aFxuXG5GcmFuY2hpbm8uZGlyZWN0aXZlICdteVNsaWRlc2hvdycsIC0+XG4gIHJlc3RyaWN0OiAnQUMnXG4gIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMpIC0+XG4gICAgY29uZmlnID0gYW5ndWxhci5leHRlbmQoXG4gICAgICBzbGlkZXM6ICcuc2xpZGUnLFxuICAgIHNjb3BlLiRldmFsKGF0dHJzLm15U2xpZGVzaG93KSlcbiAgICBzZXRUaW1lb3V0ICgtPlxuICAgICAgJChlbGVtZW50KS5jeWNsZSAtPlxuICAgICAgICBmeDogICAgICdmYWRlJyxcbiAgICAgICAgc3BlZWQ6ICAnZmFzdCcsXG4gICAgICAgIG5leHQ6ICAgJyNuZXh0MicsXG4gICAgICAgIHByZXY6ICAgJyNwcmV2MicsXG4gICAgICAgIGNhcHRpb246ICcjYWx0LWNhcHRpb24nLFxuICAgICAgICBjYXB0aW9uX3RlbXBsYXRlOiAne3tpbWFnZXMuYWx0fX0nLFxuICAgICAgICBwYXVzZV9vbl9ob3ZlcjogJ3RydWUnXG5cbiAgICApLCAwXG4iLCJBVVRIMF9DTElFTlRfSUQgPSAnQTEyNlhXZEpaWTcxNXczQjZ5VkNldnBTOHRZbVBKcmonXG5BVVRIMF9ET01BSU4gPSAnZm9vdGJyb3MuYXV0aDAuY29tJ1xuQVVUSDBfQ0FMTEJBQ0tfVVJMID0gbG9jYXRpb24uaHJlZiIsIndpbmRvdy5GcmFuY2hpbm8gPSBhbmd1bGFyLm1vZHVsZSgndGFwLmNvbnRyb2xsZXJzJywgW10pXG5cbkZyYW5jaGluby5jb250cm9sbGVyICdMb2dpbkN0cmwnLCAoJHNjb3BlLCBhdXRoLCAkc3RhdGUsIHN0b3JlKSAtPlxuXG4gIGRvQXV0aCA9IC0+XG4gICAgYXV0aC5zaWduaW4ge1xuICAgICAgY2xvc2FibGU6IGZhbHNlXG4gICAgICBhdXRoUGFyYW1zOiBzY29wZTogJ29wZW5pZCBvZmZsaW5lX2FjY2VzcydcbiAgICB9XG4gICAgcmV0dXJuXG5cbiAgJHNjb3BlLiRvbiAnJGlvbmljLnJlY29ubmVjdFNjb3BlJywgLT5cbiAgICBkb0F1dGgoKVxuICAgIHJldHVyblxuICBkb0F1dGgoKVxuICByZXR1cm5cblxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSW50cm9DdHJsJywgKCRzY29wZSwgJHN0YXRlLCAkaW9uaWNTbGlkZUJveERlbGVnYXRlKSAtPlxuICAkc2NvcGUuc3RhcnRBcHAgPSAtPlxuICAgICRzdGF0ZS5nbygnYXBwLnByb2R1Y3RzJylcblxuICAkc2NvcGUubmV4dCA9IC0+XG4gICAgJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZS5uZXh0KClcblxuICAkc2NvcGUucHJldmlvdXMgPSAtPlxuICAgICRpb25pY1NsaWRlQm94RGVsZWdhdGUucHJldmlvdXMoKVxuXG5cbiAgJHNjb3BlLnNsaWRlQ2hhbmdlZCA9IChpbmRleCkgLT5cbiAgICAkc2NvcGUuc2xpZGVJbmRleCA9IGluZGV4XG5cbiAgcmV0dXJuXG5cbkZyYW5jaGluby5jb250cm9sbGVyICdBcHBDdHJsJywgKCRzY29wZSkgLT5cbiAgIyBXaXRoIHRoZSBuZXcgdmlldyBjYWNoaW5nIGluIElvbmljLCBDb250cm9sbGVycyBhcmUgb25seSBjYWxsZWRcbiAgIyB3aGVuIHRoZXkgYXJlIHJlY3JlYXRlZCBvciBvbiBhcHAgc3RhcnQsIGluc3RlYWQgb2YgZXZlcnkgcGFnZSBjaGFuZ2UuXG4gICMgVG8gbGlzdGVuIGZvciB3aGVuIHRoaXMgcGFnZSBpcyBhY3RpdmUgKGZvciBleGFtcGxlLCB0byByZWZyZXNoIGRhdGEpLFxuICAjIGxpc3RlbiBmb3IgdGhlICRpb25pY1ZpZXcuZW50ZXIgZXZlbnQ6XG4gICMkc2NvcGUuJG9uKCckaW9uaWNWaWV3LmVudGVyJywgZnVuY3Rpb24oZSkge1xuICAjfSk7XG4gIHJldHVyblxuXG5cbkZyYW5jaGluby5jb250cm9sbGVyICdEYXNoQ3RybCcsICgkc2NvcGUsICRodHRwKSAtPlxuXG4gICRzY29wZS5jYWxsQXBpID0gLT5cbiAgICAjIEp1c3QgY2FsbCB0aGUgQVBJIGFzIHlvdSdkIGRvIHVzaW5nICRodHRwXG4gICAgJGh0dHAoXG4gICAgICB1cmw6ICdodHRwOi8vYXV0aDAtbm9kZWpzYXBpLXNhbXBsZS5oZXJva3VhcHAuY29tL3NlY3VyZWQvcGluZydcbiAgICAgIG1ldGhvZDogJ0dFVCcpLnRoZW4gKC0+XG4gICAgICBhbGVydCAnV2UgZ290IHRoZSBzZWN1cmVkIGRhdGEgc3VjY2Vzc2Z1bGx5J1xuICAgICAgcmV0dXJuXG4gICAgKSwgLT5cbiAgICAgIGFsZXJ0ICdQbGVhc2UgZG93bmxvYWQgdGhlIEFQSSBzZWVkIHNvIHRoYXQgeW91IGNhbiBjYWxsIGl0LidcbiAgICAgIHJldHVyblxuICAgIHJldHVyblxuXG4gIHJldHVyblxuXG4jIC0tLVxuIyBnZW5lcmF0ZWQgYnkganMyY29mZmVlIDIuMC40XG4iLCJhbmd1bGFyLm1vZHVsZShcInRhcC5kaXJlY3RpdmVzXCIsIFtdKVxuICAuZGlyZWN0aXZlIFwiZGV2aWNlXCIsIC0+XG4gICAgcmVzdHJpY3Q6IFwiQVwiXG4gICAgbGluazogLT5cbiAgICAgIGRldmljZS5pbml0KClcblxuICAuc2VydmljZSAnY29weScsICgkc2NlKSAtPlxuICAgIGNvcHkgPVxuICAgICAgYWJvdXQ6XG4gICAgICAgIGhlYWRpbmc6IFwiV2UncmUgPHN0cm9uZz50YXBwaW5nPC9zdHJvbmc+IGludG8gdGhlIGZ1dHVyZVwiXG4gICAgICAgIHN1Yl9oZWFkaW5nOiBcIlRhcGNlbnRpdmUgd2FzIGNyZWF0ZWQgYnkgYSB0ZWFtIHRoYXQgaGFzIGxpdmVkIHRoZSBtb2JpbGUgY29tbWVyY2UgcmV2b2x1dGlvbiBmcm9tIHRoZSBlYXJsaWVzdCBkYXlzIG9mIG1Db21tZXJjZSB3aXRoIFdBUCwgdG8gbGVhZGluZyB0aGUgY2hhcmdlIGluIG1vYmlsZSBwYXltZW50cyBhbmQgc2VydmljZXMgd2l0aCBORkMgd29ybGR3aWRlLlwiXG4gICAgICAgIGNvcHk6IFwiPHA+Rm9yIHVzLCBtb2JpbGUgY29tbWVyY2UgaGFzIGFsd2F5cyBiZWVuIGFib3V0IG11Y2ggbW9yZSB0aGFuIHBheW1lbnQ6ICBtYXJrZXRpbmcsIHByb21vdGlvbnMsIHByb2R1Y3QgY29udGVudCwgYW5kIGxveWFsdHksIGFsbCBjb21lIHRvIGxpZmUgaW5zaWRlIGEgbW9iaWxlIHBob25lLiBNb2JpbGUgY29tbWVyY2UgcmVhbGx5IGdldHMgaW50ZXJlc3Rpbmcgd2hlbiBpdCBicmlkZ2VzIHRoZSBkaWdpdGFsIGFuZCBwaHlzaWNhbCB3b3JsZHMuPC9wPjxwPk91ciBnb2FsIGF0IFRhcGNlbnRpdmUgaXMgdG8gY3JlYXRlIGEgc3RhdGUtb2YtdGhlLWFydCBtb2JpbGUgZW5nYWdlbWVudCBwbGF0Zm9ybSB0aGF0IGVuYWJsZXMgbWFya2V0ZXJzIGFuZCBkZXZlbG9wZXJzIHRvIGNyZWF0ZSBlbnRpcmVseSBuZXcgY3VzdG9tZXIgZXhwZXJpZW5jZXMgaW4gcGh5c2ljYWwgbG9jYXRpb25zIOKAkyBhbGwgd2l0aCBhIG1pbmltdW0gYW1vdW50IG9mIHRlY2hub2xvZ3kgZGV2ZWxvcG1lbnQuPC9wPjxwPldlIHRoaW5rIHlvdeKAmWxsIGxpa2Ugd2hhdCB3ZeKAmXZlIGJ1aWx0IHNvIGZhci4gQW5kIGp1c3QgYXMgbW9iaWxlIHRlY2hub2xvZ3kgaXMgY29uc3RhbnRseSBldm9sdmluZywgc28gaXMgdGhlIFRhcGNlbnRpdmUgcGxhdGZvcm0uIEdpdmUgaXQgYSB0ZXN0IGRyaXZlIHRvZGF5LjwvcD5cIlxuICAgICAgdGVhbTpcbiAgICAgICAgaGVhZGluZzogXCJcIlxuICAgICAgICBiaW9zOlxuICAgICAgICAgIGRhdmVfcm9sZTogXCJcIlxuICAgICAgICAgIGRhdmVfY29weTogXCJcIlxuICAgIFxuXG5cbiAgICB0cnVzdFZhbHVlcyA9ICh2YWx1ZXMpIC0+XG4gICAgICBfLmVhY2ggdmFsdWVzLCAodmFsLCBrZXkpIC0+XG4gICAgICAgIHN3aXRjaCB0eXBlb2YodmFsKVxuICAgICAgICAgIHdoZW4gJ3N0cmluZydcbiAgICAgICAgICAgICRzY2UudHJ1c3RBc0h0bWwodmFsKVxuICAgICAgICAgIHdoZW4gJ29iamVjdCdcbiAgICAgICAgICAgIHRydXN0VmFsdWVzKHZhbClcblxuICAgIHRydXN0VmFsdWVzKGNvcHkpXG5cbiAgICBjb3B5XG4iLCJpZiBkZXZpY2UuZGVza3RvcCgpXG5cbmVsc2UgaWYgZGV2aWNlLm1vYmlsZSgpXG5cblx0JCA9IGRvY3VtZW50ICMgc2hvcnRjdXRcblx0Y3NzSWQgPSAnbXlDc3MnICMgeW91IGNvdWxkIGVuY29kZSB0aGUgY3NzIHBhdGggaXRzZWxmIHRvIGdlbmVyYXRlIGlkLi5cblx0aWYgISQuZ2V0RWxlbWVudEJ5SWQoY3NzSWQpXG5cdCAgICBoZWFkICA9ICQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXVxuXHQgICAgbGluayAgPSAkLmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKVxuXHQgICAgbGluay5pZCAgID0gY3NzSWRcblx0ICAgIGxpbmsucmVsICA9ICdzdHlsZXNoZWV0J1xuXHQgICAgbGluay50eXBlID0gJ3RleHQvY3NzJ1xuXHQgICAgbGluay5ocmVmID0gJy9jc3MvaW9uaWMuYXBwLm1pbi5jc3MnXG5cdCAgICBsaW5rLm1lZGlhID0gJ2FsbCdcblx0ICAgIGhlYWQuYXBwZW5kQ2hpbGQobGluaylcbiIsIndpbmRvdy5GcmFuY2hpbm8gPSBhbmd1bGFyLm1vZHVsZSgndGFwLnByb2R1Y3QnLCBbXSlcblxuRnJhbmNoaW5vLmZhY3RvcnkgJ1Byb2R1Y3QnLCAoJGh0dHAsICRyb290U2NvcGUpIC0+XG4gIHsgYWxsOiAocXVlcnlTdHJpbmcpIC0+XG4gICAgJGh0dHAuZ2V0ICRyb290U2NvcGUuc2VydmVyICsgJy9wcm9kdWN0cycsIHBhcmFtczogcXVlcnlTdHJpbmdcbiB9XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdQcm9kdWN0TGlzdEN0cmwnLCAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkaW9uaWNTY3JvbGxEZWxlZ2F0ZSwgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgUHJvZHVjdCkgLT5cbiAgJHNjb3BlLnByb2R1Y3RzID0gW11cbiAgcGFnZVNpemUgPSAyMFxuICBwcm9kdWN0Q291bnQgPSAxXG4gIHBhZ2UgPSAwXG5cbiAgJHNjb3BlLmNsZWFyU2VhcmNoID0gLT5cbiAgICAkc2NvcGUuc2VhcmNoS2V5ID0gJydcbiAgICAkc2NvcGUubG9hZERhdGEoKVxuICAgIHJldHVyblxuXG4gICRyb290U2NvcGUuJG9uICdzZWFyY2hLZXlDaGFuZ2UnLCAoZXZlbnQsIHNlYXJjaEtleSkgLT5cbiAgICAkc2NvcGUuc2VhcmNoS2V5ID0gc2VhcmNoS2V5XG4gICAgJHNjb3BlLmxvYWREYXRhKClcbiAgICByZXR1cm5cblxuICAkc2NvcGUuZm9ybWF0QWxjb2hvbExldmVsID0gKHZhbCkgLT5cbiAgICBwYXJzZUZsb2F0IHZhbFxuXG4gICRzY29wZS5sb2FkRGF0YSA9IC0+XG4gICAgcGFnZSA9IDFcbiAgICByYW5nZSA9IDFcbiAgICBQcm9kdWN0LmFsbChcbiAgICAgIHNlYXJjaDogJHNjb3BlLnNlYXJjaEtleVxuICAgICAgbWluOiByYW5nZVswXVxuICAgICAgbWF4OiByYW5nZVsxXVxuICAgICAgcGFnZTogcGFnZVxuICAgICAgcGFnZVNpemU6IHBhZ2VTaXplKS5zdWNjZXNzIChyZXN1bHQpIC0+XG4gICAgICAkc2NvcGUucHJvZHVjdHMgPSByZXN1bHQucHJvZHVjdHNcbiAgICAgIHByb2R1Y3RDb3VudCA9IHJlc3VsdC50b3RhbFxuICAgICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuJGdldEJ5SGFuZGxlKCdteVNjcm9sbCcpLmdldFNjcm9sbFZpZXcoKS5zY3JvbGxUbyAwLCAwLCB0cnVlXG4gICAgICAkc2NvcGUuJGJyb2FkY2FzdCAnc2Nyb2xsLmluZmluaXRlU2Nyb2xsQ29tcGxldGUnXG4gICAgICByZXR1cm5cbiAgICByZXR1cm5cblxuICAkc2NvcGUubG9hZE1vcmVEYXRhID0gLT5cbiAgICBwYWdlKytcbiAgICByYW5nZSA9IDFcbiAgICBQcm9kdWN0LmFsbChcbiAgICAgIHNlYXJjaDogJHNjb3BlLnNlYXJjaEtleVxuICAgICAgbWluOiByYW5nZVswXVxuICAgICAgbWF4OiByYW5nZVsxXVxuICAgICAgcGFnZTogcGFnZVxuICAgICAgcGFnZVNpemU6IHBhZ2VTaXplKS5zdWNjZXNzIChyZXN1bHQpIC0+XG4gICAgICBwcm9kdWN0Q291bnQgPSByZXN1bHQudG90YWxcbiAgICAgIEFycmF5OjpwdXNoLmFwcGx5ICRzY29wZS5wcm9kdWN0cywgcmVzdWx0LnByb2R1Y3RzXG4gICAgICAkc2NvcGUuJGJyb2FkY2FzdCAnc2Nyb2xsLmluZmluaXRlU2Nyb2xsQ29tcGxldGUnXG4gICAgICByZXR1cm5cbiAgICByZXR1cm5cblxuICAkc2NvcGUuaXNNb3JlRGF0YSA9IC0+XG4gICAgcGFnZSA8IHByb2R1Y3RDb3VudCAvIHBhZ2VTaXplXG5cbiAgcmV0dXJuXG5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ1Byb2R1Y3REZXRhaWxDdHJsJywgKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRzY2UsIFByb2R1Y3QsICRpb25pY0hpc3RvcnkpIC0+XG4gIFxuICAkc2NvcGUubXlHb0JhY2sgPSAtPlxuICAgICRpb25pY0hpc3RvcnkuZ29CYWNrKClcbiAgICByZXR1cm5cblxuICAkc2NvcGUucHJvZHVjdCA9XG4gICAgbmFtZTogJHN0YXRlUGFyYW1zLm5hbWVcbiAgICBicmV3ZXJ5OiAkc3RhdGVQYXJhbXMuYnJld2VyeVxuICAgIGFsY29ob2w6ICRzdGF0ZVBhcmFtcy5hbGNvaG9sXG4gICAgdmlkZW86ICRzdGF0ZVBhcmFtcy52aWRlb1xuICAgIHRhZ3M6ICRzdGF0ZVBhcmFtcy50YWdzXG4gICRzY29wZS50YWdzID0gJHNjb3BlLnByb2R1Y3QudGFncy5zcGxpdCgnLCAnKVxuXG4gICRzY29wZS5zZXRTZWFyY2hLZXkgPSAoc2VhcmNoS2V5KSAtPlxuICAgICRyb290U2NvcGUuJGVtaXQgJ3NlYXJjaEtleUNoYW5nZScsIHNlYXJjaEtleVxuICAgICRzdGF0ZS5nbyAncHJvZHVjdHMnXG4gICAgcmV0dXJuXG5cbiAgJHNjb3BlLmZvcm1hdEFsY29ob2xMZXZlbCA9ICh2YWwpIC0+XG4gICAgJycgKyBwYXJzZUZsb2F0KHZhbCkgKyAnJSdcblxuICAkc2NvcGUuZm9ybWF0WW91dHViZVVybCA9ICh2YWwpIC0+XG4gICAgJHNjb3BlLmN1cnJlbnRVcmwgPSAnaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJyArIHZhbCArICcnXG4gICAgJHNjb3BlLmJldHRlclVybCA9ICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKCRzY29wZS5jdXJyZW50VXJsKVxuICAgICRzY29wZS5iZXR0ZXJVcmxcblxuICByZXR1cm5cblxuIyAtLS1cbiMgZ2VuZXJhdGVkIGJ5IGpzMmNvZmZlZSAyLjAuNCJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==