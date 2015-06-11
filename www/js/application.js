if (device.desktop()) {
  window.Franchino = angular.module('Franchino', ['ngSanitize', 'ui.router', 'btford.socket-io', 'tap.controllers', 'tap.directives']);
} else {
  window.Franchino = angular.module("Franchino", ['ionic', 'btford.socket-io', 'tap.controllers', 'tap.directives', 'tap.product', 'auth0', 'angular-storage', 'angular-jwt']);
}

Franchino.run(function($ionicPlatform, $rootScope) {
  $rootScope.server = 'https://alcura.herokuapp.com';
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
      return window.location.href = 'http://alcura-shop.herokuapp.com';
    });
  });
  authProvider.on("authenticated", function($location, error) {
    return $location.url('http://alcura-shop.herokuapp.com');
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiLCJhdXRoMC12YXJpYWJsZXMuY29mZmVlIiwiY29udHJvbGxlcnMuY29mZmVlIiwiZGlyZWN0aXZlcy5jb2ZmZWUiLCJpbml0LmNvZmZlZSIsInByb2R1Y3QuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUcsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFIO0FBQ0UsRUFBQSxNQUFNLENBQUMsU0FBUCxHQUFtQixPQUFPLENBQUMsTUFBUixDQUFlLFdBQWYsRUFBNEIsQ0FBQyxZQUFELEVBQWUsV0FBZixFQUE0QixrQkFBNUIsRUFBZ0QsaUJBQWhELEVBQW1FLGdCQUFuRSxDQUE1QixDQUFuQixDQURGO0NBQUEsTUFBQTtBQUlFLEVBQUEsTUFBTSxDQUFDLFNBQVAsR0FBbUIsT0FBTyxDQUFDLE1BQVIsQ0FBZSxXQUFmLEVBQTRCLENBQUUsT0FBRixFQUM3QyxrQkFENkMsRUFFN0MsaUJBRjZDLEVBRzdDLGdCQUg2QyxFQUk3QyxhQUo2QyxFQUs3QyxPQUw2QyxFQU03QyxpQkFONkMsRUFPN0MsYUFQNkMsQ0FBNUIsQ0FBbkIsQ0FKRjtDQUFBOztBQUFBLFNBYVMsQ0FBQyxHQUFWLENBQWMsU0FBQyxjQUFELEVBQWlCLFVBQWpCLEdBQUE7QUFDWixFQUFBLFVBQVUsQ0FBQyxNQUFYLEdBQW9CLDhCQUFwQixDQUFBO0FBQUEsRUFDQSxjQUFjLENBQUMsS0FBZixDQUFxQixTQUFBLEdBQUE7QUFDakIsSUFBQSxJQUFHLE1BQU0sQ0FBQyxTQUFWO0FBQ0UsTUFBQSxTQUFTLENBQUMsWUFBVixDQUFBLENBQUEsQ0FERjtLQUFBO0FBSUEsSUFBQSxJQUFHLE1BQU0sQ0FBQyxPQUFQLElBQW1CLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQTdDO0FBQ0UsTUFBQSxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyx3QkFBekIsQ0FBa0QsSUFBbEQsQ0FBQSxDQURGO0tBSkE7QUFNQSxJQUFBLElBQUcsTUFB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QUFNLENBQUMsU0FBUCxHQUFtQixJQUFJLENBQUMsa0JBQUwsQ0FBd0IsTUFBTSxDQUFDLFVBQS9CLENBRG5CLENBQUE7V0FFQSxNQUFNLENBQUMsVUFIaUI7RUFBQSxDQXBCMUIsQ0FGd0M7QUFBQSxDQUExQyxDQS9EQSxDQUFBIiwiZmlsZSI6ImFwcGxpY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaWYgZGV2aWNlLmRlc2t0b3AoKVxuICB3aW5kb3cuRnJhbmNoaW5vID0gYW5ndWxhci5tb2R1bGUoJ0ZyYW5jaGlubycsIFsnbmdTYW5pdGl6ZScsICd1aS5yb3V0ZXInLCAnYnRmb3JkLnNvY2tldC1pbycsICd0YXAuY29udHJvbGxlcnMnLCAndGFwLmRpcmVjdGl2ZXMnXSlcblxuZWxzZVxuICB3aW5kb3cuRnJhbmNoaW5vID0gYW5ndWxhci5tb2R1bGUoXCJGcmFuY2hpbm9cIiwgWyAnaW9uaWMnLFxuICAgICdidGZvcmQuc29ja2V0LWlvJyxcbiAgICAndGFwLmNvbnRyb2xsZXJzJyxcbiAgICAndGFwLmRpcmVjdGl2ZXMnLFxuICAgICd0YXAucHJvZHVjdCcsXG4gICAgJ2F1dGgwJyxcbiAgICAnYW5ndWxhci1zdG9yYWdlJyxcbiAgICAnYW5ndWxhci1qd3QnXSlcblxuRnJhbmNoaW5vLnJ1biAoJGlvbmljUGxhdGZvcm0sICRyb290U2NvcGUpIC0+XG4gICRyb290U2NvcGUuc2VydmVyID0gJ2h0dHBzOi8vYWxjdXJhLmhlcm9rdWFwcC5jb20nXG4gICRpb25pY1BsYXRmb3JtLnJlYWR5IC0+XG4gICAgICBpZiB3aW5kb3cuU3RhdHVzQmFyXG4gICAgICAgIFN0YXR1c0Jhci5zdHlsZURlZmF1bHQoKVxuICAgICAgIyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXG4gICAgICAjIGZvciBmb3JtIGlucHV0cylcbiAgICAgIGlmIHdpbmRvdy5jb3Jkb3ZhIGFuZCB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkXG4gICAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIgdHJ1ZVxuICAgICAgaWYgd2luZG93LlN0YXR1c0JhclxuICAgICAgICAjIG9yZy5hcGFjaGUuY29yZG92YS5zdGF0dXNiYXIgcmVxdWlyZWRcbiAgICAgICAgU3RhdHVzQmFyLnN0eWxlRGVmYXVsdCgpXG4gICAgICByZXR1cm5cbiAgICByZXR1cm5cblxuXG5GcmFuY2hpbm8uY29uZmlnICgkc2NlRGVsZWdhdGVQcm92aWRlcikgLT5cbiAgJHNjZURlbGVnYXRlUHJvdmlkZXIucmVzb3VyY2VVcmxXaGl0ZWxpc3QgW1xuICAgICAgJ3NlbGYnXG4gICAgICBuZXcgUmVnRXhwKCdeKGh0dHBbc10/KTovLyh3ezN9Lik/eW91dHViZS5jb20vLiskJylcbiAgICBdXG4gIHJldHVyblxuXG5cbkZyYW5jaGluby5jb25maWcgKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyLCBhdXRoUHJvdmlkZXIsIGp3dEludGVyY2VwdG9yUHJvdmlkZXIpIC0+XG5cbiAgJHN0YXRlUHJvdmlkZXJcblxuICAgIC5zdGF0ZSAnYXBwJyxcbiAgICAgIHVybDogJydcbiAgICAgIGFic3RyYWN0OiB0cnVlXG4gICAgICBjb250cm9sbGVyOiAnQXBwQ3RybCdcbiAgICAgIHRlbXBsYXRlVXJsOiAnbWVudS5odG1sJ1xuXG4gICAgLnN0YXRlKCdsb2dpbicsXG4gICAgICB1cmw6ICcvbG9naW4nXG4gICAgICB0ZW1wbGF0ZVVybDogJ2xvZ2luLmh0bWwnXG4gICAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJylcblxuICAgIC5zdGF0ZSgnYXBwLnByb2R1Y3RzJyxcbiAgICAgIHVybDogJy9wcm9kdWN0cydcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3Byb2R1Y3QtbGlzdC5odG1sJ1xuICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0TGlzdEN0cmwnKVxuXG4gICAgLnN0YXRlICdhcHAucHJvZHVjdC1kZXRhaWwnLFxuICAgICAgdXJsOiAnL3Byb2R1Y3QvOm5hbWUvOmJyZXdlcnkvOmFsY29ob2wvOnRhZ3MvOnZpZGVvJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAncHJvZHVjdC1kZXRhaWwuaHRtbCdcbiAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdERldGFpbEN0cmwnXG5cbiAgICAuc3RhdGUgJ2FwcC5pbnRybycsXG4gICAgICB1cmw6ICcvaW50cm8nLFxuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdJbnRyb0N0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdpbnRyby5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuaG9tZScsXG4gICAgICB1cmw6ICcvaG9tZSdcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnSG9tZUN0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdob21lLmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5kb2NzJyxcbiAgICAgIHVybDogJy9kb2NzJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdEb2NzQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2RvY3MvaW5kZXguaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmFib3V0JyxcbiAgICAgIHVybDogJy9hYm91dCdcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnQWJvdXRDdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYWJvdXQuaHRtbCdcblxuXG4gICAgLnN0YXRlICdhcHAuYmxvZycsXG4gICAgICB1cmw6ICcvYmxvZydcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnQmxvZ0N0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdibG9nLmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5yZXN1bWUnLFxuICAgICAgdXJsOiAnL3Jlc3VtZSdcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnUmVzdW1lQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3Jlc3VtZS5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuY29udGFjdCcsXG4gICAgICB1cmw6ICcvY29udGFjdCdcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnQ29udGFjdEN0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb250YWN0Lmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5kb2MnLFxuICAgICAgdXJsOiAnL2RvY3MvOnBlcm1hbGluaydcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnRG9jQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2RvY3Mvc2hvdy5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuc3RlcCcsXG4gICAgICB1cmw6ICcvZG9jcy86cGVybWFsaW5rLzpzdGVwJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdEb2NDdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZG9jcy9zaG93Lmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5qb2ItdGFwY2VudGl2ZScsXG4gICAgICB1cmw6ICcvam9iLXRhcGNlbnRpdmUnXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0pvYlRhcGNlbnRpdmVDdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnam9iLXRhcGNlbnRpdmUuaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmpvYi10YXBjZW50aXZlLXR3bycsXG4gICAgICB1cmw6ICcvam9iLXRhcGNlbnRpdmUtdHdvJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdKb2JUYXBjZW50aXZlVHdvQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2pvYi10YXBjZW50aXZlLXR3by5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuam9iLWNwZ2lvJyxcbiAgICAgIHVybDogJy9qb2ItY3BnaW8nXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0pvYkNwZ2lvQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2pvYi1jcGdpby5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuam9iLW1lZHljYXRpb24nLFxuICAgICAgdXJsOiAnL2pvYi1tZWR5Y2F0aW9uJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdKb2JNZWR5Y2F0aW9uQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2pvYi1tZWR5Y2F0aW9uLmh0bWwnXG5cbiAgICAuc3RhdGUgJ2FwcC5qb2ItY3N0JyxcbiAgICAgIHVybDogJy9qb2ItY3N0J1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdKb2JDc3RDdHJsJ1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnam9iLWNzdC5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuam9iLWtvdXBuJyxcbiAgICAgIHVybDogJy9qb2Ita291cG4nXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0pvYktvdXBuQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2pvYi1rb3Vwbi5odG1sJ1xuXG4gICAgLnN0YXRlICdhcHAuam9iLXRyb3VuZCcsXG4gICAgICB1cmw6ICcvam9iLXRyb3VuZCdcbiAgICAgIHZpZXdzOlxuICAgICAgICBtZW51Q29udGVudDpcbiAgICAgICAgICBjb250cm9sbGVyOiAnSm9iVHJvdW5kQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2pvYi10cm91bmQuaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmpvYi1tb250aGx5cycsXG4gICAgICB1cmw6ICcvam9iLW1vbnRobHlzJ1xuICAgICAgdmlld3M6XG4gICAgICAgIG1lbnVDb250ZW50OlxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdKb2JNb250aGx5c0N0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdqb2ItbW9udGhseXMuaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmpvYi1tb250aGx5cy10d28nLFxuICAgICAgdXJsOiAnL2pvYi1tb250aGx5cy10d28nXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0pvYk1vbnRobHlzVHdvQ3RybCdcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2pvYi1tb250aGx5cy10d28uaHRtbCdcblxuICAgIC5zdGF0ZSAnYXBwLmpvYi1iZW5jaHByZXAnLFxuICAgICAgdXJsOiAnL2pvYi1iZW5jaHByZXAnXG4gICAgICB2aWV3czpcbiAgICAgICAgbWVudUNvbnRlbnQ6XG4gICAgICAgICAgY29udHJvbGxlcjogJ0pvYkJlbmNocHJlcEN0cmwnXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdqb2ItYmVuY2hwcmVwLmh0bWwnXG5cbiAgICAgICAgIyBDb25maWd1cmUgQXV0aDBcbiAgICAgIGF1dGhQcm92aWRlci5pbml0XG4gICAgICAgIGRvbWFpbjogQVVUSDBfRE9NQUlOXG4gICAgICAgIGNsaWVudElEOiBBVVRIMF9DTElFTlRfSURcbiAgICAgICAgc3NvOiB0cnVlXG4gICAgICAgIGxvZ2luU3RhdGU6ICdwcm9kdWN0cydcblxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UgXCIvcHJvZHVjdHNcIlxuXG4gICAgand0SW50ZXJjZXB0b3JQcm92aWRlci50b2tlbkdldHRlciA9IChzdG9yZSwgand0SGVscGVyLCBhdXRoKSAtPlxuICAgICAgaWRUb2tlbiA9IHN0b3JlLmdldCgndG9rZW4nKVxuICAgICAgcmVmcmVzaFRva2VuID0gc3RvcmUuZ2V0KCdyZWZyZXNoVG9rZW4nKVxuICAgICAgaWYgIWlkVG9rZW4gb3IgIXJlZnJlc2hUb2tlblxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgaWYgand0SGVscGVyLmlzVG9rZW5FeHBpcmVkKGlkVG9rZW4pXG4gICAgICAgIGF1dGgucmVmcmVzaElkVG9rZW4ocmVmcmVzaFRva2VuKS50aGVuIChpZFRva2VuKSAtPlxuICAgICAgICAgIHN0b3JlLnNldCAndG9rZW4nLCBpZFRva2VuXG4gICAgICAgICAgaWRUb2tlblxuICAgICAgZWxzZVxuICAgICAgICBpZFRva2VuXG5cbiAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2ggJ2p3dEludGVyY2VwdG9yJ1xuICAgICAgcmV0dXJuXG5cbiAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoIC0+XG4gICAgICAgcmVxdWVzdDogKGNvbmZpZykgLT5cbiAgICAgICAgIGlmIGNvbmZpZy51cmwubWF0Y2goL1xcLmh0bWwkLykgJiYgIWNvbmZpZy51cmwubWF0Y2goL15zaGFyZWRcXC8vKVxuICAgICAgICAgICBpZiBkZXZpY2UudGFibGV0KClcbiAgICAgICAgICAgICB0eXBlID0gJ3RhYmxldCdcbiAgICAgICAgICAgZWxzZSBpZiBkZXZpY2UubW9iaWxlKClcbiAgICAgICAgICAgICB0eXBlID0gJ21vYmlsZSdcbiAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgIHR5cGUgPSAnZGVza3RvcCdcblxuICAgICAgICAgICBjb25maWcudXJsID0gXCIvI3t0eXBlfS8je2NvbmZpZy51cmx9XCJcblxuICAgICAgICAgY29uZmlnXG5cbiAgYXV0aFByb3ZpZGVyLm9uIFwibG9naW5TdWNjZXNzXCIsICgkbG9jYXRpb24sIHByb2ZpbGVQcm9taXNlLCBpZFRva2VuLCBzdG9yZSwgcmVmcmVzaFRva2VuKSAtPlxuICAgIHByb2ZpbGVQcm9taXNlLnRoZW4gKHByb2ZpbGUpIC0+XG4gICAgICBsb2NrID0gbmV3IEF1dGgwTG9jaygnQTEyNlhXZEpaWTcxNXczQjZ5VkNldnBTOHRZbVBKcmonLCAnZm9vdGJyb3MuYXV0aDAuY29tJyk7XG5cbiAgICAgIHN0b3JlLnNldCAncHJvZmlsZScsIHByb2ZpbGVcbiAgICAgIHN0b3JlLnNldCAndG9rZW4nLCBpZFRva2VuXG4gICAgICBzdG9yZS5zZXQgJ3JlZnJlc2hUb2tlbicsIHJlZnJlc2hUb2tlblxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Rva2VuJywgaWRUb2tlbik7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdodHRwOi8vYWxjdXJhLXNob3AuaGVyb2t1YXBwLmNvbSdcblxuICBhdXRoUHJvdmlkZXIub24gXCJhdXRoZW50aWNhdGVkXCIsICgkbG9jYXRpb24sIGVycm9yKSAtPlxuICAgICRsb2NhdGlvbi51cmwgJ2h0dHA6Ly9hbGN1cmEtc2hvcC5oZXJva3VhcHAuY29tJ1xuXG5cbiAgYXV0aFByb3ZpZGVyLm9uIFwibG9naW5GYWlsdXJlXCIsICgkbG9jYXRpb24sIGVycm9yKSAtPlxuXG5cbkZyYW5jaGluby5ydW4gKCRyb290U2NvcGUsIGF1dGgsIHN0b3JlKSAtPlxuICAkcm9vdFNjb3BlLiRvbiAnJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCAtPlxuICAgIGlmICFhdXRoLmlzQXV0aGVudGljYXRlZFxuICAgICAgdG9rZW4gPSBzdG9yZS5nZXQoJ3Rva2VuJylcbiAgICAgIGlmIHRva2VuXG4gICAgICAgIGF1dGguYXV0aGVudGljYXRlIHN0b3JlLmdldCgncHJvZmlsZScpLCB0b2tlblxuICAgIHJldHVyblxuICByZXR1cm5cblxuXG5GcmFuY2hpbm8ucnVuICgkc3RhdGUpIC0+XG4gICRzdGF0ZS5nbygnYXBwLmhvbWUnKVxuXG5GcmFuY2hpbm8ucnVuICgkcm9vdFNjb3BlLCBjb3B5KSAtPlxuICAkcm9vdFNjb3BlLmNvcHkgPSBjb3B5XG5cbkZyYW5jaGluby5mYWN0b3J5ICdTb2NrZXQnLCAoc29ja2V0RmFjdG9yeSkgLT5cbiAgc29ja2V0RmFjdG9yeSgpXG5cbkZyYW5jaGluby5mYWN0b3J5ICdEb2NzJywgKFNvY2tldCkgLT5cbiAgc2VydmljZSA9XG4gICAgbGlzdDogW11cbiAgICBmaW5kOiAocGVybWFsaW5rKSAtPlxuICAgICAgXy5maW5kIHNlcnZpY2UubGlzdCwgKGRvYykgLT5cbiAgICAgICAgZG9jLnBlcm1hbGluayA9PSBwZXJtYWxpbmtcblxuICBTb2NrZXQub24gJ2RvY3MnLCAoZG9jcykgLT5cbiAgICBzZXJ2aWNlLmxpc3QgPSBkb2NzXG5cbiAgc2VydmljZVxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSG9tZUN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnQ29udGFjdFNoZWV0Q3RybCcsICgkc2NvcGUsICRpb25pY0FjdGlvblNoZWV0KSAtPlxuICAkc2NvcGUuc2hvd0FjdGlvbnNoZWV0ID0gLT5cbiAgICAkaW9uaWNBY3Rpb25TaGVldC5zaG93XG4gICAgICB0aXRsZVRleHQ6IFwiQ29udGFjdCBGcmFuY2hpbm9cIlxuICAgICAgYnV0dG9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCJHaXRodWIgPGkgY2xhc3M9XFxcImljb24gaW9uLXNoYXJlXFxcIj48L2k+XCJcbiAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCJFbWFpbCBNZSA8aSBjbGFzcz1cXFwiaWNvbiBpb24tZW1haWxcXFwiPjwvaT5cIlxuICAgICAgICB9XG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiBcIlR3aXR0ZXIgPGkgY2xhc3M9XFxcImljb24gaW9uLXNvY2lhbC10d2l0dGVyXFxcIj48L2k+XCJcbiAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCIyMjQtMjQxLTkxODkgPGkgY2xhc3M9XFxcImljb24gaW9uLWlvcy10ZWxlcGhvbmVcXFwiPjwvaT5cIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgICBjYW5jZWxUZXh0OiBcIkNhbmNlbFwiXG4gICAgICBjYW5jZWw6IC0+XG4gICAgICAgIGNvbnNvbGUubG9nIFwiQ0FOQ0VMTEVEXCJcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGJ1dHRvbkNsaWNrZWQ6IChpbmRleCkgLT5cbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIjIyNC0yNDEtOTE4OVwiICBpZiBpbmRleCBpcyAyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCJodHRwOi8vdHdpdHRlci5jb20vZnJhbmNoaW5vX2NoZVwiICBpZiBpbmRleCBpcyAyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCJtYWlsdG86ZnJhbmNoaW5vLm5vbmNlQGdtYWlsLmNvbVwiICBpZiBpbmRleCBpcyAxXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCJodHRwOi8vZ2l0aHViLmNvbS9mcmFuZ3VjY1wiICBpZiBpbmRleCBpcyAwXG4gICAgICAgIHRydWVcblxuICByZXR1cm5cbkZyYW5jaGluby5jb250cm9sbGVyIFwiU2xpZGVzVGFwT25lQ3RybFwiLCAoJHNjb3BlKSAtPlxuICAkc2NvcGUuZGF0ZSA9ICdOT1ZFTUJFUiAyMDE0J1xuICAkc2NvcGUudGl0bGUgPSAnVGFwY2VudGl2ZSBtYW5hZ2VyIFVYIG92ZXJoYXVsIGFuZCBmcm9udC1lbmQnXG4gICRzY29wZS5pbWFnZXMgPSBbXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiVGFwY2VudGl2ZS5jb20gVVggb3ZlcmhhdWwgYW5kIFNQQSBmcm9udC1lbmRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZ2lmL3JlcG9ydC5naWZcIixcbiAgICAgIFwidGV4dFwiIDogXCI8cD5TdHVkeSB0aGUgdXNlciBhbmQgdGhlaXIgZ29hbHMgYW5kIG92ZXJoYXVsIHRoZSBleHBlcmllbmNlIHdoaWxlIHJlLXdyaXRpbmcgdGhlIGZyb250LWVuZCBpbiBBbmd1bGFyLjwvcD48YSBocmVmPSdodHRwOi8vdGFwY2VudGl2ZS5jb20nIHRhcmdldD0nX2JsYW5rJz5WaXNpdCBXZWJzaXRlPC9hPlwiXG4gICAgfVxuICBdXG5cbkZyYW5jaGluby5jb250cm9sbGVyIFwiU2xpZGVzVGFwVHdvQ3RybFwiLCAoJHNjb3BlKSAtPlxuICAkc2NvcGUuZGF0ZSA9ICdPQ1RPQkVSIDIwMTQnXG4gICRzY29wZS50aXRsZSA9ICdEZXNrdG9wIGFuZCBtb2JpbGUgd2ViIGZyaWVuZGx5IG1hcmtldGluZyB3ZWJzaXRlJ1xuICAkc2NvcGUuaW1hZ2VzID0gW1xuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLXRhcGNlbnRpdmUteWVsbG93LmpwZ1wiLFxuICAgICAgXCJ0ZXh0XCIgOiBcIjxwPkNyZWF0ZSBhIGtub2Nrb3V0IGJyYW5kIHN0cmF0ZWd5IHdpdGggYW4gYXdlc29tZSBsb29rIGFuZCBmZWVsLiBNYWtlIGEgc29waGlzdGljYXRlZCBvZmZlcmluZyBsb29rIHNpbXBsZSBhbmQgZWFzeSB0byB1c2UuPC9wPjxhIGhyZWY9J2h0dHA6Ly90YXBjZW50aXZlLmNvbScgdGFyZ2V0PSdfYmxhbmsnPlZpc2l0IFdlYnNpdGU8L2E+XCJcbiAgICB9XG5cbiAgXVxuXG5GcmFuY2hpbm8uY29udHJvbGxlciBcIlNsaWRlc0NwZ0N0cmxcIiwgKCRzY29wZSkgLT5cbiAgJHNjb3BlLmRhdGUgPSAnSlVMWSAyMDE0J1xuICAkc2NvcGUudGl0bGUgPSAnSWRlbnRpdHksIGZ1bGwtc3RhY2sgTVZQLCBhbmQgbWFya2V0aW5nIHdlYnNpdGUgZm9yIGEgbmV3IENQRyBlRGlzdHJpYnV0aW9uIGNvbXBhbnknXG4gICRzY29wZS5pbWFnZXMgPSBbXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2lub19jcGdpby5qcGdcIixcbiAgICAgIFwidGV4dFwiIDogXCI8cD5UdXJuIGFuIG9sZCBzY2hvb2wgQ1BHIGJ1c2luZXNzIGludG8gYSBzb3BoaXN0aWNhdGVkIHRlY2hub2xvZ3kgY29tcGFueS4gRGVzaWduIHNlY3VyZSwgYXV0b21hdGVkIGFuZCB0cmFuc2Zvcm1hdGl2ZSBwbGF0Zm9ybSwgdGVjaG5pY2FsIGFyY2hpdGVjdHVyZSBhbmQgZXhlY3V0ZSBhbiBNVlAgZW5vdWdoIHRvIGFxdWlyZSBmaXJzdCBjdXN0b21lcnMuIE1pc3Npb24gYWNjb21wbGlzaGVkLjwvcD48YSBocmVmPSdodHRwOi8vY3BnLmlvJyB0YXJnZXQ9J19ibGFuayc+VmlzaXQgV2Vic2l0ZTwvYT5cIlxuICAgIH1cbiAgXVxuXG5GcmFuY2hpbm8uY29udHJvbGxlciBcIlNsaWRlc01lZHljYXRpb25DdHJsXCIsICgkc2NvcGUpIC0+XG4gICRzY29wZS5kYXRlID0gJ0FQUklMIDIwMTQnXG4gICRzY29wZS50aXRsZSA9ICdVc2VyIGV4cGVyaWVuY2UgZGVzaWduIGFuZCByYXBpZCBwcm90b3R5cGluZyBmb3IgTWVkeWNhdGlvbiwgYSBuZXcgaGVhbHRoY2FyZSBwcmljZSBjb21wYXJpc29uIHdlYnNpdGUnXG4gICRzY29wZS5pbWFnZXMgPSBbXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm8tbWVkeWNhdGlvbi5qcGdcIixcbiAgICAgIFwidGV4dFwiIDogXCI8cD5XYWx0eiB1cCBpbiB0aGUgb25saW5lIGhlYWx0aGNhcmUgaW5kdXN0cnkgZ3VucyBibGF6aW5nIHdpdGgga2lsbGVyIGRlc2lnbiBhbmQgaW5zdGluY3RzLiBHZXQgdGhpcyBuZXcgY29tcGFueSBvZmYgdGhlIGdyb3VuZCB3aXRoIGl0J3MgTVZQLiBTd2lwZSBmb3IgbW9yZSB2aWV3cy48L3A+PGEgaHJlZj0naHR0cDovL21lZHljYXRpb24uY29tJyB0YXJnZXQ9J19ibGFuayc+VmlzaXQgV2Vic2l0ZTwvYT5cIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm8tbWVkeWNhdGlvbjIuanBnXCIsXG4gICAgICBcInRleHRcIiA6IFwiXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLW1lZHljYXRpb24zLmpwZ1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1tZWR5Y2F0aW9uNC5qcGdcIlxuICAgIH0sXG4gIF1cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgXCJTbGlkZXNDU1RDdHJsXCIsICgkc2NvcGUpIC0+XG4gICRzY29wZS5kYXRlID0gJ0FQUklMIDIwMTQnXG4gICRzY29wZS50aXRsZSA9ICdEZXNpZ25lZCBhbmQgZGV2ZWxvcGVkIGEgbmV3IHZlcnNpb24gb2YgdGhlIENoaWNhZ28gU3VuIFRpbWVzIHVzaW5nIGEgaHlicmlkIElvbmljL0FuZ3VsYXIgc3RhY2snXG4gICRzY29wZS5pbWFnZXMgPSBbXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm8tY3N0LmpwZ1wiLFxuICAgICAgXCJ0ZXh0XCIgOiBcIjxwPkhlbHAgdGhlIHN0cnVnZ2xpbmcgbWVkaWEgZ2lhbnQgdXBncmFkZSB0aGVpciBjb25zdW1lciBmYWNpbmcgdGVjaG5vbG9neS4gQ3JlYXRlIG9uZSBjb2RlIGJhc2UgaW4gQW5ndWxhciBjYXBhYmxlIG9mIGdlbmVyYXRpbmcga2ljay1hc3MgZXhwZXJpZW5jZXMgZm9yIG1vYmlsZSwgdGFibGV0LCB3ZWIgYW5kIFRWLlwiXG4gICAgfSxcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1jc3QyLmpwZ1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1jc3QzLmpwZ1wiXG4gICAgfSxcbiAgXVxuXG5GcmFuY2hpbm8uY29udHJvbGxlciBcIlNsaWRlc0tvdXBuQ3RybFwiLCAoJHNjb3BlKSAtPlxuICAkc2NvcGUuZGF0ZSA9ICdNQVJDSCAyMDE0J1xuICAkc2NvcGUudGl0bGUgPSAnQnJhbmQgcmVmcmVzaCwgbWFya2V0aW5nIHNpdGUgYW5kIHBsYXRmb3JtIGV4cGVyaWVuY2Ugb3ZlcmhhdWwnXG4gICRzY29wZS5pbWFnZXMgPSBbXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm8ta291cG4xLmpwZ1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1rb3VwbjIuanBnXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLWtvdXBuLmpwZ1wiXG4gICAgfSxcbiAgXVxuXG5GcmFuY2hpbm8uY29udHJvbGxlciBcIlNsaWRlc1Ryb3VuZEN0cmxcIiwgKCRzY29wZSkgLT5cbiAgJHNjb3BlLmRhdGUgPSAnQVVHVVNUIDIwMTMnXG4gICRzY29wZS50aXRsZSA9ICdTb2NpYWwgdHJhdmVsIG1vYmlsZSBhcHAgZGVzaWduLCBVWCBhbmQgcmFwaWQgcHJvdG90eXBpbmcnXG4gICRzY29wZS5pbWFnZXMgPSBbXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2lub190cm91bmQuanBnXCIsXG4gICAgICBcInRleHRcIiA6IFwiRGVzaWduIGFuIEluc3RhZ3JhbSBiYXNlZCBzb2NpYWwgdHJhdmVsIGFwcC4gV2h5PyBJIGRvbid0IGtub3cuXCJcbiAgICB9XG4gIF1cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgXCJTbGlkZXNNb250aGx5c0N0cmxcIiwgKCRzY29wZSkgLT5cbiAgJHNjb3BlLmRhdGUgPSAnRkVCUlVBUlkgMjAxMydcbiAgJHNjb3BlLnRpdGxlID0gJ0N1c3RvbWVyIHBvcnRhbCBwbGF0Zm9ybSBVWCBkZXNpZ24gYW5kIGZyb250LWVuZCdcbiAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1tb250aGx5cy1iaXoyLmpwZ1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGlub19tb250aGx5cy5qcGdcIlxuICAgIH1cbiAgXVxuXG5GcmFuY2hpbm8uY29udHJvbGxlciBcIlNsaWRlc01vbnRobHlzVHdvQ3RybFwiLCAoJHNjb3BlKSAtPlxuICAkc2NvcGUuZGF0ZSA9ICdNQVJDSCAyMDEyJ1xuICAkc2NvcGUudGl0bGUgPSAnRW50cmVwcmVuZXVyIGluIHJlc2lkZW5jZSBhdCBMaWdodGJhbmsnXG4gICRzY29wZS5pbWFnZXMgPSBbXG4gICAge1xuICAgICAgXCJhbHRcIiA6IFwiU29tZSBhbHQgdGV4dFwiLFxuICAgICAgXCJ1cmxcIiA6IFwiL2ltZy9mcmFuY2hpbm8tbW9udGhseXM3LmpwZ1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBcImFsdFwiIDogXCJTb21lIGFsdCB0ZXh0XCIsXG4gICAgICBcInVybFwiIDogXCIvaW1nL2ZyYW5jaGluby1tb250aGx5czUuanBnXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiYWx0XCIgOiBcIlNvbWUgYWx0IHRleHRcIixcbiAgICAgIFwidXJsXCIgOiBcIi9pbWcvZnJhbmNoaW5vLW1vbnRobHlzMi5qcGdcIlxuICAgIH1cbiAgXVxuXG5GcmFuY2hpbm8uY29udHJvbGxlciBcIkJsb2dDdHJsXCIsICgkc2NvcGUpIC0+XG5cbiAgJHNjb3BlLmFydGljbGVzID0gW1xuICAgIHtcbiAgICAgIFwiZGF0ZVwiIDogXCJQb3N0ZWQgYnkgRnJhbmNoaW5vIG9uIERlY2VtYmVyIDEyLCAyMDE0XCIsXG4gICAgICBcImhlYWRpbmdcIiA6IFwiTXkgcGF0aCB0byBsZWFybmluZyBTd2lmdFwiLFxuICAgICAgXCJhdXRob3JpbWdcIiA6IFwiL2ltZy9mcmFuay5wbmdcIixcbiAgICAgIFwiaW1nXCIgOiBcIi9pbWcvZGVjL25ld3NsZXR0ZXItc3dpZnRyaXMtaGVhZGVyLmdpZlwiLFxuICAgICAgXCJibG9iXCIgOiBcIkkndmUgYmVlbiBhbiBNVkMgZGV2ZWxvcGVyIGluIGV2ZXJ5IGxhbmd1YWdlIGV4Y2VwdCBmb3IgaU9TLiBUaGlzIHBhc3QgT2N0b2JlciwgSSB0b29rIG15IGZpcnN0IHJlYWwgZGVlcCBkaXZlIGludG8gaU9TIHByb2dyYW1taW5nIGFuZCBzdGFydGVkIHdpdGggU3dpZnQuIFRoZXJlIGFyZSB0d28gZ3JlYXQgdHV0b3JpYWxzIG91dCB0aGVyZS4gVGhlIGZpcnN0IGlzIGZyb20gYmxvYy5pbyBhbmQgaXMgZnJlZS4gSXQncyBhIGdhbWUsIFN3aWZ0cmlzLCBzbyBnZXQgcmVhZHkgZm9yIHNvbWUgYWN0aW9uLiBUaGUgc2Vjb25kIHdpbGwgaGVscCB5b3UgYnVpbGQgc29tZXRoaW5nIG1vcmUgYXBwaXNoLCBpdCdzIGJ5IEFwcGNvZGEuIEdvdCB0aGVpciBib29rIGFuZCB3aWxsIGJlIGRvbmUgd2l0aCBpdCB0aGlzIHdlZWsuIFNvIGZhciwgYm9va3Mgb2ssIGJ1dCBpdCBtb3ZlcyByZWFsbHkgc2xvdy5cIixcbiAgICAgIFwicmVzb3VyY2UxXCIgOiBcImh0dHBzOi8vd3d3LmJsb2MuaW8vc3dpZnRyaXMtYnVpbGQteW91ci1maXJzdC1pb3MtZ2FtZS13aXRoLXN3aWZ0XCIsXG4gICAgICBcInJlc291cmNlMlwiIDogXCJodHRwOi8vd3d3LmFwcGNvZGEuY29tL3N3aWZ0L1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBcImRhdGVcIiA6IFwiUG9zdGVkIGJ5IEZyYW5jaGlubyBvbiBEZWNlbWJlciAxMSwgMjAxNFwiLFxuICAgICAgXCJoZWFkaW5nXCIgOiBcIldoeSBJIGdldCBnb29zZSBidW1wcyB3aGVuIHlvdSB0YWxrIGFib3V0IGF1dG9tYXRlZCBlbWFpbCBtYXJrZXRpbmcgYW5kIHNlZ21lbnRhdGlvbiBhbmQgY3VzdG9tZXIuaW8gYW5kIHRoaW5ncyBsaWtlIHRoYXQuXCIsXG4gICAgICBcImF1dGhvcmltZ1wiIDogXCIvaW1nL2ZyYW5rLnBuZ1wiLFxuICAgICAgXCJpbWdcIiA6IFwiL2ltZy9kZWMvcHJlcGVtYWlscy5wbmdcIixcbiAgICAgIFwiYmxvYlwiIDogXCJJIGdldCB0ZWFyeSBleWVkIHdoZW4gSSB0YWxrIGFib3V0IG15IHdvcmsgYXQgQmVuY2hQcmVwLmNvbS4gSW4gc2hvcnQsIEkgd2FzIHRoZSBmaXJzdCBlbXBsb3llZSBhbmQgaGVscGVkIHRoZSBjb21wYW55IGdldCB0byB0aGVpciBzZXJpZXMgQiBuZWFyIHRoZSBlbmQgb2YgeWVhciB0d28uIEkgZ290IGEgbG90IGRvbmUgdGhlcmUsIGFuZCBvbmUgb2YgdGhlIHRoaW5ncyBJIHJlYWxseSBlbmpveWVkIHdhcyBidWlsZGluZyBvdXQgdGVjaG5vbG9neSB0byBzZWdtZW50IGxlYWRzLCBicmluZyBkaWZmZXJlbnQgdXNlcnMgZG93biBkaWZmZXJlbnQgY29tbXVuaWNhdGlvbiBwYXRocyBhbmQgaG93IEkgbWFwcGVkIG91dCB0aGUgZW50aXJlIHN5c3RlbSB1c2luZyBjb21wbGV4IGRpYWdyYW1zIGFuZCB3b3JrZmxvd3MuIFNvbWUgb2YgdGhlIHRvb2xzIHdlcmUgYnVpbHQgYW5kIGJhc2VkIG9uIHF1ZXMgbGlrZSBSZWRpcyBvciBSZXNxdWUsIG90aGVycyB3ZSBidWlsdCBpbnRvIEV4YWN0VGFyZ2V0IGFuZCBDdXN0b21lci5pby4gSW4gdGhlIGVuZCwgSSBiZWNhbWUgc29tZXdoYXQgb2YgYW4gZXhwZXJ0IGF0IG1vbmV0aXppbmcgZW1haWxzLiBXaXRoaW4gb3VyIGVtYWlsIG1hcmtldGluZyBjaGFubmVsLCB3ZSBleHBsb3JlZCB0YWdnaW5nIHVzZXJzIGJhc2VkIG9uIHRoZWlyIGFjdGlvbnMsIHN1Y2ggYXMgb3BlbnMgb3Igbm9uIG9wZW5zLCBvciB3aGF0IHRoZXkgY2xpY2tlZCBvbiwgd2UgdGFyZ2VkIGVtYWlsIHVzZXJzIHdobyBoYWQgYmVlbiB0b3VjaGVkIHNldmVuIHRpbWVzIHdpdGggc3BlY2lhbCBpcnJpc2l0YWJsZSBzYWxlcywgYmVjYXVzZSB3ZSBrbm93IGFmdGVyIDYgdG91Y2hlcywgd2UgY291bGQgY29udmVydC4gVGhlc2UgdHJpY2tzIHdlIGxlYXJuZWQgbGVkIHRvIDI1LTMwayBkYXlzLCBhbmQgZXZlbnR1YWxseSwgZGF5cyB3aGVyZSB3ZSBzb2xkIDEwMGsgd29ydGggb2Ygc3Vic2NyaXB0aW9ucy4gU28sIG15IHBvaW50PyBEb24ndCBiZSBzdXJwcmlzZWQgaWYgSSBnZWVrIG91dCBhbmQgZmFpbnQgd2hlbiBJIGhlYXIgeW91IHRhbGsgYWJvdXQgdHJhbnNhY3Rpb25hbCBlbWFpbGluZyBhbmQgY2FkZW5jZXMgYW5kIGNvbnN1bWVyIGpvdXJuaWVzIGFuZCBzdHVmZiBsaWtlIHRoYXQuXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiZGF0ZVwiIDogXCJQb3N0ZWQgYnkgRnJhbmNoaW5vIG9uIERlY2VtYmVyIDEwLCAyMDE0XCIsXG4gICAgICBcImhlYWRpbmdcIiA6IFwiSWYgSSBjb3VsZCBoYXZlIG9uZSB3aXNoOyBJIGdldCB0byB1c2UgdGhpcyBtZXRob2Qgd2hlbiBkZXNpZ25pbmcgeW91ciBjb25zdW1lciBqb3VybmV5IGZ1bm5lbC5cIixcbiAgICAgIFwiYXV0aG9yaW1nXCIgOiBcIi9pbWcvZnJhbmsucG5nXCIsXG4gICAgICBcImltZ1wiIDogXCIvaW1nL2RlYy91eF9ib2FyZC5qcGdcIixcbiAgICAgIFwiYmxvYlwiIDogXCJTbyBhZnRlciBhIGJ1bmNoIG9mIGV0aG5vZ3JhcGhpYyBzdHVkaWVzIGZyb20gcGVyc29uYSBtYXRjaGVzIEkgZ2F0aGVyIGluLXBlcnNvbiwgSSBnZXQgdG8gZmlsbCBhIHdhbGwgdXAgd2l0aCBrZXkgdGhpbmdzIHBlb3BsZSBzYWlkLCBmZWx0LCBoZWFyZCAtIG1vdGl2YXRvcnMsIGJhcnJpZXJzLCBxdWVzdGlvbnMsIGF0dGl0dWRlcyBhbmQgc3VjaC4gSSB0aGVuIGdyb3VwIHRoZXNlIHBvc3QtaXQgdGhvdWdodHMgaW4gdmFyaW91cyB3YXlzLCBsb29raW5nIGZvciBwYXR0ZXJucywgc2VudGltZW50LCBuZXcgaWRlYXMuIEkgdGhlbiB0YWtlIHRoaXMgcmljaCBkYXRhIGFuZCBkZXZlbG9wIGEgd2hhdCBjb3VsZCBiZSBicmFuZGluZywgYSBsYW5kaW5nIHBhZ2Ugb3IgYW4gZW1haWwgLSB3aXRoIHdoYXQgSSBjYWxsLCBhbiBpbnZlcnRlZCBweXJhbWlkIGFwcHJvYWNoIHRvIGNvbnRlbnQsIHdoZXJlIGFkZHJlc3NpbmcgdGhlIG1vc3QgaW1wb3J0YW50IHRoaW5ncyBmb3VuZCBpbiB0aGUgdXNlciByZXNlYXJjaCBnZXQgYWRkcmVzc2VkIGluIGEgaGVyaWFyY2hpY2FsIG9yZGVyLiBJIGNyZWF0ZSA1LTYgaXRlcmF0aW9ucyBvZiB0aGUgbGFuZGluZyBwYWdlIGFuZCByZS1ydW4gdGhlbSB0aHJvdWdoIGEgc2Vjb25kIGdyb3VwIG9mIHBhcnRpY2lwYW50cywgc3Rha2Vob2xkZXJzIGFuZCBmcmllbmRzLiBJIHRoZW4gdGFrZSBldmVuIG1vcmUgbm90ZXMgb24gcGVvcGxlcyBzcGVhay1hbG91ZCByZWFjdGlvbnMgdG8gdGhlIGxhbmRpbmcgcGFnZXMuIEFmdGVyIHRoaXMsIEknbSByZWFkeSB0byBkZXNpZ24gdGhlIGZpbmFsIGNvcHkgYW5kIHBhZ2VzIGZvciB5b3VyIGZ1bm5lbC5cIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJkYXRlXCIgOiBcIlBvc3RlZCBieSBGcmFuY2hpbm8gb24gRGVjZW1iZXIgOSwgMjAxNFwiLFxuICAgICAgXCJoZWFkaW5nXCIgOiBcIkRpZCBJIGV2ZW4gYmVsb25nIGhlcmU/XCIsXG4gICAgICBcImF1dGhvcmltZ1wiIDogXCIvaW1nL2ZyYW5rLnBuZ1wiLFxuICAgICAgXCJpbWdcIiA6IFwiL2ltZy9kZWMvdWNsYS5qcGdcIixcbiAgICAgIFwiYmxvYlwiIDogXCJUaGlzIGNvbWluZyB3ZWVrZW5kIHRoZXJlJ3MgcHJvYmFibHkgYSBoYWNrYXRob24gZ29pbmcgb24gaW4geW91ciBjaXR5LiBTb21lIG9mIHRoZW0gYXJlIGdldHRpbmcgcmVhbGx5IGJpZy4gSSB3YXNuJ3QgcmVnaXN0ZXJlZCBmb3IgTEEgSGFja3MgdGhpcyBzdW1tZXIuIEkgZG9uJ3QgZXZlbiBrbm93IGhvdyBJIGVuZGVkIHVwIHRoZXJlIG9uIGEgRnJpZGF5IG5pZ2h0LCBidXQgd2hlbiBJIHNhdyB3aGF0IHdhcyBnb2luZyBvbiwgSSBncmFiYmVkIGEgY2hhaXIgYW5kIHN0YXJ0ZWQgaGFja2luZyBhd2F5LiBXb3JyaWVkIEkgaGFkIGp1c3Qgc251Y2sgaW4gdGhlIGJhY2sgZG9vciBhbmQgc3RhcnRlZCBjb21wZXRpbmcsIG15IHJpZGUgbGVmdCBhbmQgdGhlcmUgSSB3YXMsIGZvciB0aGUgbmV4dCB0d28gZGF5cy4gVGhhdCdzIHJpZ2h0LiBJIHNudWNrIGluIHRoZSBiYWNrIG9mIExBIEhhY2tzIGxhc3Qgc3VtbWVyIGF0IFVDTEEgYW5kIGhhY2tlZCB3aXRoIGtpZHMgMTAgeWVhcnMgeW91bmdlciB0aGFuIG1lLiBJIGNvdWxkbid0IG1pc3MgaXQuIEkgd2FzIGZsb29yZWQgd2hlbiBJIHNhdyBob3cgbWFueSBwZW9wbGUgd2VyZSBpbiBpdC4gTWUsIGJlaW5nIHRoZSBtaXNjaGV2aW91cyBoYWNrZXIgSSBhbSwgSSB0aG91Z2h0IGlmIEkgdXNlZCB0aGUgZW5lcmd5IG9mIHRoZSBlbnZpcm9ubWVudCB0byBteSBhZHZhbnRhZ2UsIEkgY291bGQgYnVpbGQgc29tZXRoaW5nIGNvb2wuIExvbmcgc3Rvcnkgc2hvcnQsIGxldCBtZSBqdXN0IHNheSwgdGhhdCBpZiB5b3UgaGF2ZSBiZWVuIGhhdmluZyBhIGhhcmQgdGltZSBsYXVuY2hpbmcsIHNpZ24gdXAgZm9yIGEgaGFja2F0aG9uLiBJdCdzIGEgZ3VhcmFudGVlZCB3YXkgdG8gb3Zlci1jb21wZW5zYXRlIGZvciB5b3VyIGNvbnN0YW50IGZhaWx1cmUgdG8gbGF1bmNoLiBNb3JlIG9uIHdoYXQgaGFwcGVuZWQgd2hlbiBJIHRvb2sgdGhlIHN0YWdlIGJ5IHN1cnByaXNlIGFuZCBnb3QgYm9vdGVkIGxhdGVyLi4uXCJcbiAgICB9XG4gIF1cblxuXG5cbkZyYW5jaGluby5jb250cm9sbGVyICdBYm91dEN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnQXBwQ3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdSZXN1bWVDdHJsJywgKCRzY29wZSkgLT5cbiAgJHNjb3BlLmJsb2IgPSAnPGRpdiBjbGFzcz1cInJvd1wiPjxkaXYgY2xhc3M9XCJsYXJnZS0xMlwiPjxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwibGFyZ2UtMTIgY29sdW1uc1wiPjxoNj5OT1YgMjAxMyAtIFBSRVNFTlQ8L2g2Pjxici8+PGgyPkh5YnJpZCBFeHBlcmllbmNlIERlc2lnbmVyL0RldmVsb3BlciwgSW5kZXBlbmRlbnQ8L2gyPjxici8+PHA+V29ya2VkIHdpdGggbm90ZWFibGUgZW50cmVwcmVub3VycyBvbiBzZXZlcmFsIG5ldyBwcm9kdWN0IGFuZCBidXNpbmVzcyBsYXVuY2hlcy4gSGVsZCBudW1lcm91cyByb2xlcywgaW5jbHVkaW5nIGNvbnRlbnQgc3RyYXRlZ2lzdCwgdXNlciByZXNlYXJjaGVyLCBkZXNpZ25lciBhbmQgZGV2ZWxvcGVyLiA8L3A+PHA+PHN0cm9uZz5Db21wYW5pZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwibm9cIj48bGk+PGEgaHJlZj1cImh0dHA6Ly90YXBjZW50aXZlLmNvbVwiIHRhcmdldD1cIl9ibGFua1wiPlRhcGNlbnRpdmU8L2E+PC9saT48bGk+PGEgaHJlZj1cImh0dHA6Ly9jcGcuaW9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5DUEdpbzwvYT48L2xpPjxsaT48YSBocmVmPVwiaHR0cDovL2tvdS5wbi9cIj5Lb3UucG4gTWVkaWE8L2E+PC9saT48bGk+IDxhIGhyZWY9XCJodHRwOi8vbWVkeWNhdGlvbi5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5NZWR5Y2F0aW9uPC9hPjwvbGk+PGxpPiA8YSBocmVmPVwiaHR0cDovL3d3dy5zdW50aW1lcy5jb20vXCIgdGFyZ2V0PVwiX2JsYW5rXCI+Q2hpY2FnbyBTdW4gVGltZXM8L2E+PC9saT48L3VsPjxici8+PHA+PHN0cm9uZz5UYXBjZW50aXZlIERlbGl2ZXJhYmxlczwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJidWxsZXRzXCI+PGxpPkNvbXBsZXRlIFRhcGNlbnRpdmUuY29tIG1hcmtldGluZyB3ZWJzaXRlIGFuZCBVWCBvdmVyaGF1bCBvZiBjb3JlIHByb2R1Y3QsIHRoZSBcIlRhcGNlbnRpdmUgTWFuYWdlclwiPC9saT48bGk+SW5kdXN0cmlhbCBkZXNpZ24gb2YgdGhlIFRhcGNlbnRpdmUgVG91Y2hwb2ludDwvbGk+PGxpPkNvbnRlbnQgc3RyYXRlZ3kgZm9yIGNvcnBvcmF0ZSBtYXJrZXRpbmcgc2l0ZTwvbGk+PGxpPk1vYmlsZSBmaXJzdCBtYXJrZXRpbmcgd2Vic2l0ZSB1c2luZyBJb25pYyBhbmQgQW5ndWxhcjwvbGk+PC91bD48cD48c3Ryb25nPkNQR2lvIERlbGl2ZXJhYmxlczwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJidWxsZXRzXCI+PGxpPlByb2R1Y3QgYW5kIGJ1c2luZXNzIHN0cmF0ZWd5LCB0ZWNobmljYWwgYXJjaGl0ZWN0dXJlIGFuZCBzcGVjaWZpY2F0aW9uIGRlc2lnbjwvbGk+PGxpPk9uZSBodW5kcmVkIHBhZ2UgcHJvcG9zYWwgdGVtcGxhdGUgb24gYnVzaW5lc3MgbW9kZWwgYW5kIGNvcnBvcmF0ZSBjYXBhYmlsaXRpZXM8L2xpPjxsaT5NYXJrZXRpbmcgd2Vic2l0ZSBkZXNpZ24gYW5kIGNvbnRlbnQgc3RyYXRlZ3k8L2xpPjxsaT5Db3JlIHByb2R1Y3QgZGVzaWduIGFuZCBNVlAgZnVuY3Rpb25hbCBwcm90b3R5cGU8L2xpPjwvdWw+PHA+PHN0cm9uZz5Lb3UucG4gRGVsaXZlcmFibGVzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHNcIj48bGk+S291LnBuIE1lZGlhIGJyYW5kIHJlZnJlc2g8L2xpPjxsaT5NYXJrZXRpbmcgc2l0ZSByZWRlc2lnbjwvbGk+PGxpPlBvcnRhbCB1c2VyIGV4cGVyaWVuY2Ugb3ZlcmhhdWw8L2xpPjwvdWw+PHA+PHN0cm9uZz5NZWR5Y2F0aW9uIERlbGl2ZXJhYmxlczwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJidWxsZXRzXCI+PGxpPkNvbmNlcHR1YWwgZGVzaWduIGFuZCBhcnQgZGlyZWN0aW9uPC9saT48bGk+VXNlciByZXNlYXJjaDwvbGk+PGxpPlJhcGlkIHByb3RvdHlwZXM8L2xpPjwvdWw+PHA+PHN0cm9uZz5DaGljYWdvIFN1biBUaW1lczwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJidWxsZXRzXCI+PGxpPkNvbmNlcHR1YWwgZGVzaWduIGFuZCBhcnQgZGlyZWN0aW9uPC9saT48bGk+TmF0aXZlIGlPUyBhbmQgQW5kcm9pZCBhcHAgZGVzaWduIGFuZCBqdW5pb3IgZGV2ZWxvcG1lbnQ8L2xpPjxsaT5IeWJyaWQgSW9uaWMvQW5ndWxhciBkZXZlbG9wbWVudDwvbGk+PC91bD48L2Rpdj48L2Rpdj48YnIvPjxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwibGFyZ2UtMTIgY29sdW1uc1wiPjxoNj5NQVJDSCAyMDEwIC0gT0NUT0JFUiAyMDEzPC9oNj48YnIvPjxoMj5EaXJlY3RvciBvZiBVc2VyIEV4cGVyaWVuY2UsIExpZ2h0YmFuazwvaDI+PGJyLz48cD5MYXVuY2hlZCBhbmQgc3VwcG9ydGVkIG11bHRpcGxlIG5ldyBjb21wYW5pZXMgd2l0aGluIHRoZSBMaWdodGJhbmsgcG9ydGZvbGlvLiA8L3A+PHA+PHN0cm9uZz5Db21wYW5pZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwibm9cIj48bGk+IDxhIGhyZWY9XCJodHRwOi8vY2hpY2Fnb2lkZWFzLmNvbVwiIHRhcmdldD1cIl9ibGFua1wiPkNoaWNhZ29JZGVhcy5jb208L2E+PC9saT48bGk+IDxhIGhyZWY9XCJodHRwOi8vYmVuY2hwcmVwLmNvbVwiIHRhcmdldD1cIl9ibGFua1wiPkJlbmNoUHJlcC5jb208L2E+PC9saT48bGk+IDxhIGhyZWY9XCJodHRwOi8vc25hcHNoZWV0YXBwLmNvbVwiIHRhcmdldD1cIl9ibGFua1wiPlNuYXBTaGVldEFwcC5jb208L2E+PC9saT48bGk+TW9udGhseXMuY29tIChkZWZ1bmN0KTwvbGk+PGxpPiA8YSBocmVmPVwiaHR0cDovL2RvdWdoLmNvbVwiIHRhcmdldD1cIl9ibGFua1wiPkRvdWdoLmNvbTwvYT48L2xpPjxsaT4gPGEgaHJlZj1cImh0dHA6Ly9ncm91cG9uLmNvbVwiIHRhcmdldD1cIl9ibGFua1wiPkdyb3Vwb24uY29tPC9hPjwvbGk+PC91bD48YnIvPjxwPjxzdHJvbmc+Q2hpY2FnbyBJZGVhcyBEZWxpdmVyYWJsZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5XZWJzaXRlIGRlc2lnbiByZWZyZXNoLCBhcnQgZGlyZWN0aW9uPC9saT48bGk+Q3VzdG9tIHRpY2tldCBwdXJjaGFzaW5nIHBsYXRmb3JtIFVYIHJlc2VhcmNoICZhbXA7IGRlc2lnbjwvbGk+PGxpPlJ1Ynkgb24gUmFpbHMgZGV2ZWxvcG1lbnQsIG1haW50ZW5lbmNlPC9saT48bGk+R3JhcGhpYyBkZXNpZ24gc3VwcG9ydDwvbGk+PGxpPkFubnVhbCByZXBvcnQgZGVzaWduPC9saT48L3VsPjxwPjxzdHJvbmc+QmVuY2hQcmVwLmNvbSBEZWxpdmVyYWJsZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5SZS1icmFuZGluZywgY29tcGxldGUgQmVuY2hQcmVwIGlkZW50aXR5IHBhY2thZ2U8L2xpPjxsaT5TdXBwb3J0ZWQgY29tcGFueSB3aXRoIGFsbCBkZXNpZ24gYW5kIHV4IGZyb20gemVybyB0byBlaWdodCBtaWxsaW9uIGluIGZpbmFuY2luZzwvbGk+PGxpPkxlYWQgYXJ0IGFuZCBVWCBkaXJlY3Rpb24gZm9yIHR3byB5ZWFyczwvbGk+PGxpPkZyb250LWVuZCB1c2luZyBCYWNrYm9uZSBhbmQgQm9vdHN0cmFwPC9saT48bGk+VXNlciByZXNlYXJjaCwgZXRobm9ncmFwaGljIHN0dWRpZXMsIHVzZXIgdGVzdGluZzwvbGk+PGxpPkVtYWlsIG1hcmtldGluZyBjYWRlbmNlIHN5c3RlbSBkZXNpZ24gYW5kIGV4ZWN1dGlvbjwvbGk+PGxpPlNjcmlwdGVkLCBzdG9yeWJvYXJkZWQgYW5kIGV4ZWN1dGVkIGJvdGggYW5pbWF0ZWQgYW5kIGxpdmUgbW90aW9uIGV4cGxhaW5lciB2aWRlb3M8L2xpPjwvdWw+PHA+PHN0cm9uZz5TbmFwU2hlZXRBcHAuY29tIERlbGl2ZXJhYmxlczwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJidWxsZXRzXCI+PGxpPkxhcmdlIHNjYWxlIHBvcnRhbCBVWCByZXNlYXJjaCBhbmQgaW5mb3JtYXRpb24gYXJjaGl0ZWN0dXJlPC9saT48bGk+VGhyZWUgcm91bmRzIG9mIHJhcGlkIHByb3RvdHlwaW5nIGFuZCB1c2VyIHRlc3Rpbmc8L2xpPjxsaT5HcmFwaGljIGRlc2lnbiBhbmQgaW50ZXJhY3Rpb24gZGVzaWduIGZyYW1ld29yazwvbGk+PGxpPlVzZXIgdGVzdGluZzwvbGk+PC91bD48cD48c3Ryb25nPk1vbnRobHlzLmNvbSBEZWxpdmVyYWJsZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5JZGVudGl0eSBhbmQgYXJ0IGRpcmVjdGlvbjwvbGk+PGxpPlByb2R1Y3Qgc3RyYXRlZ3kgYW5kIG5ldyBjb21wYW55IGxhdW5jaDwvbGk+PGxpPk9ubGluZSBtYXJrZXRpbmcgc3RyYXRlZ3ksIGluY2x1ZGluZyB0cmFuc2FjdGlvbmFsIGVtYWlsLCBwcm9tb3Rpb24gZGVzaWduIGFuZCBsZWFkIGdlbmVyYXRpb248L2xpPjxsaT5Qcm9kdWN0IGV4cGVyaWVuY2UgZGVzaWduIGFuZCBmcm9udC1lbmQ8L2xpPjxsaT5Db250ZW50IHN0cmF0ZWd5PC9saT48bGk+U2NyaXB0ZWQsIHN0b3J5Ym9hcmRlZCBhbmQgZXhlY3V0ZWQgYm90aCBhbmltYXRlZCBhbmQgbGl2ZSBtb3Rpb24gZXhwbGFpbmVyIHZpZGVvczwvbGk+PC91bD48cD48c3Ryb25nPkRvdWdoLmNvbSBEZWxpdmVyYWJsZXM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0cyBidWxsZXRzXCI+PGxpPkNvbnN1bWVyIGpvdXJuZXkgbWFwcGluZyBhbmQgZXRobm9ncmFwaGljIHN0dWRpZXM8L2xpPjxsaT5SYXBpZCBwcm90b3R5cGluZywgY29uY2VwdHVhbCBkZXNpZ248L2xpPjxsaT5NZXNzYWdpbmcgc3RyYXRlZ3ksIHVzZXIgdGVzdGluZzwvbGk+PC91bD48cD48c3Ryb25nPkdyb3Vwb24uY29tIERlbGl2ZXJhYmxlczwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJidWxsZXRzXCI+PGxpPkVtZXJnaW5nIG1hcmtldHMgcmVzZWFyY2g8L2xpPjxsaT5SYXBpZCBkZXNpZ24gYW5kIHByb3RvdHlwaW5nPC9saT48bGk+VmlzdWFsIGRlc2lnbiBvbiBuZXcgY29uY2VwdHM8L2xpPjxsaT5FbWFpbCBzZWdtZW50YXRpb24gcmVzZWFyY2g8L2xpPjwvdWw+PC9kaXY+PC9kaXY+PGJyLz48ZGl2IGNsYXNzPVwicm93XCI+PGRpdiBjbGFzcz1cImxhcmdlLTEyIGNvbHVtbnNcIj48aDY+Tk9WRU1CRVIgMjAwNyAtIEFQUklMIDIwMTA8L2g2Pjxici8+PGgyPkRldmVsb3BlciAmYW1wOyBDby1mb3VuZGVyLCBEaWxseWVvLmNvbTwvaDI+PGJyLz48cD5Dby1mb3VuZGVkLCBkZXNpZ25lZCBhbmQgZGV2ZWxvcGVkIGEgZGFpbHkgZGVhbCBlQ29tbWVyY2Ugd2Vic2l0ZS48L3A+PHA+PHN0cm9uZz5Sb2xlPC9zdHJvbmc+PGJyLz5EZXNpZ25lZCwgZGV2ZWxvcGVkIGFuZCBsYXVuY2hlZCBjb21wYW5pZXMgZmlyc3QgY2FydCB3aXRoIFBIUC4gSXRlcmF0ZWQgYW5kIGdyZXcgc2l0ZSB0byBtb3JlIHRoYW4gdHdvIGh1bmRyZWQgYW5kIGZpZnR5IHRob3VzYW5kIHN1YnNjcmliZXJzIGluIGxlc3MgdGhhbiBvbmUgeWVhci4gPC9wPjxwPjxzdHJvbmc+Tm90ZWFibGUgU3RhdHM8L3N0cm9uZz48L3A+PHVsIGNsYXNzPVwiYnVsbGV0c1wiPjxsaT5CdWlsdCBhIGxpc3Qgb2YgMjUwLDAwMCBzdWJzY3JpYmVycyBpbiB0aGUgZmlyc3QgeWVhcjwvbGk+PGxpPlBpdm90ZWQgYW5kIHR3ZWFrZWQgZGVzaWduLCBidXNpbmVzcyBhbmQgYXBwcm9hY2ggdG8gMTAwMCB0cmFuc2FjdGlvbnMgcGVyIGRhaWx5PC9saT48bGk+U29sZCBidXNpbmVzcyBpbiBEZWNlbWJlciAyMDA5IHRvIElubm92YXRpdmUgQ29tbWVyY2UgU29sdXRpb25zPC9saT48L3VsPjwvZGl2PjwvZGl2Pjxici8+PGRpdiBjbGFzcz1cInJvd1wiPjxkaXYgY2xhc3M9XCJsYXJnZS0xMiBjb2x1bW5zXCI+PGg2Pk1BUkNIIDIwMDUgLSBPQ1RPQkVSIDIwMDc8L2g2Pjxici8+PGgyPlNvbHV0aW9ucyBBcmNoaXRlY3QgJmFtcDsgU2VuaW9yIERldmVsb3BlciwgPGEgaHJlZj1cImh0dHA6Ly93d3cubWFuaWZlc3RkaWdpdGFsLmNvbS9cIj5NYW5pZmVzdCBEaWdpdGFsPC9hPjwvaDI+PGJyLz48cD5CdWlsdCBhbmQgbWFuYWdlZCBtdWx0aXBsZSBDYXJlZXJCdWlsZGVyLmNvbSBuaWNoZSBzaXRlcyBmb3IgdGhlIGxhcmdlc3QgaW5kZXBlbmRlbnQgYWdlbmN5IGluIHRoZSBtaWR3ZXN0LjwvcD48cD48c3Ryb25nPlJvbGU8L3N0cm9uZz48YnIvPlJlc2VhcmNoIGFuZCBleHBsb3JlIGVtZXJnaW5nIHRlY2hub2xvZ2llcywgaW1wbGVtZW50IHNvbHV0aW9ucyBhbmQgbWFuYWdlIG90aGVyIGRldmVsb3BlcnMuIFdvcmtlZCB3aXRoIGFzcC5uZXQgb24gYSBkYWlseSBiYXNpcyBmb3IgYWxtb3N0IHR3byB5ZWFycy4gPC9wPjxwPjxzdHJvbmc+Tm90ZWFibGUgQWNjb21wbGlzaG1lbnRzPC9zdHJvbmc+PC9wPjx1bCBjbGFzcz1cImJ1bGxldHNcIj48bGk+UmVjb2duaXplZCBmb3IgbGF1bmNoaW5nIGhpZ2ggcXVhbGl0eSB3ZWIgYXBwIGZvciBDYXJlZXIgQnVpbGRlciBpbiByZWNvcmQgdGltZTwvbGk+PGxpPk1hbmFnZWQgZXh0cmVtZSBTRU8gcHJvamVjdCB3aXRoIG1vcmUgdGhhbiA1MDAgdGhvdXNhbmQgbGlua3MsIHBhZ2VzIGFuZCBvdmVyIDggbWlsbGlvbiBVR0MgYXJ0aWZhY3RzPC9saT48bGk+U2hpZnRlZCBhZ2VuY2llcyBkZXZlbG9wbWVudCBwcmFjdGljZXMgdG8gdmFyaW91cyBuZXcgY2xpZW50LWNlbnRyaWMgQUpBWCBtZXRob2RvbG9naWVzPC9saT48bGk+TWFuYWdlZCBtdWx0aXBsZSBwcm9qZWN0cyBjb25jdXJyZW50bHksIGluY2x1ZGluZyBjaG9vc2VjaGljYWdvLmNvbSBhbmQgYnJpZWZpbmcuY29tPC9saT48L3VsPjwvZGl2PjwvZGl2Pjxici8+PGRpdiBjbGFzcz1cInJvd1wiPjxkaXYgY2xhc3M9XCJsYXJnZS0xMiBjb2x1bW5zXCI+PGg2PkFQUklMIDIwMDQgLSBKQU5VQVJZIDIwMDc8L2g2Pjxici8+PGgyPkp1bmlvciBQTEQgRGV2ZWxvcGVyLCAgPGEgaHJlZj1cImh0dHA6Ly93d3cubWFuaWZlc3RkaWdpdGFsLmNvbS9cIj5BdmVudWU8L2E+PC9oMj48YnIvPjxwPkZyb250LWVuZCBkZXZlbG9wZXIgYW5kIFVYIGRlc2lnbiBpbnRlcm4gZm9yIEF2ZW51ZSBBIFJhem9yZmlzaHNcXCcgbGVnYWN5IGNvbXBhbnksIEF2ZW51ZS1pbmMuPC9wPjxwPjxzdHJvbmc+Um9sZTwvc3Ryb25nPjxici8+RGV2ZWxvcCBmcm9udC1lbmQgZm9yIG11bHRpcGxlIGNsaWVudCB3ZWJzaXRlcywgaW5jbHVkaW5nIGZsb3IuY29tLCBhY2hpZXZlbWVudC5vcmcsIGNhbnlvbnJhbmNoLmNvbSBhbmQgdHVyYm9jaGVmLjwvcD48cD48c3Ryb25nPk5vdGVhYmxlIEFjY29tcGxpc2htZW50czwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJidWxsZXRzXCI+PGxpPkV4ZWN1dGVkIGZyb250LWVuZCBwcm9qZWN0cyBvbi10aW1lIGFuZCB1bmRlci1idWRnZXQ8L2xpPjxsaT5Bc3NpZ25lZCBVWCBpbnRlcm5zaGlwIHJvbGUsIHJlY29nbml6ZWQgYnkgZGVzaWduIHRlYW0gYXMgYSB5b3VuZyB0YWxlbnQ8L2xpPjxsaT5XaXJlZnJhbWVkIGN1c3RvbSBzaG9wcGluZyBjYXJ0IHBsYXRmb3JtIGZvciBmbG9yLmNvbTwvbGk+PGxpPkRldmVsb3BlZCBpbnRlcm5hbCBTRU8gcHJhY3RpY2U8L2xpPjwvdWw+PC9kaXY+PC9kaXY+PGJyLz48ZGl2IGNsYXNzPVwicm93XCI+PGRpdiBjbGFzcz1cImxhcmdlLTEyIGNvbHVtbnNcIj48aDY+SlVMWSAyMDAwIC0gSkFOVUFSWSAyMDA0PC9oNj48YnIvPjxoMj5lQ29tbWVyY2UgRGV2ZWxvcGVyLCBBdG92YTwvaDI+PGJyLz48cD5HZW5lcmFsIHdlYiBkZXNpZ25lciBhbmQgZGV2ZWxvcGVyIGZvciBmYW1pbHkgb3duZWQgcGFpbnQgZGlzdHJpYnV0aW9uIGJ1c2luZXNzLiA8L3A+PHA+PHN0cm9uZz5Sb2xlPC9zdHJvbmc+PGJyLz5CdWlsdCBzZXZlcmFsIHNob3BwaW5nIGNhcnRzIGluIGNsYXNzaWMgQVNQIGFuZCBQSFAuIEdyZXcgYnVzaW5lc3MgdXNpbmcgb25saW5lIG1hcmtldGluZyBzdHJhdGVnaWVzIHRvIHR3byBtaWxsaW9uIGluIHJldmVudWUuIDwvcD48cD48c3Ryb25nPk5vdGVhYmxlIEFjY29tcGxpc2htZW50czwvc3Ryb25nPjwvcD48dWwgY2xhc3M9XCJidWxsZXRzXCI+PGxpPkJlY2FtZSBmaXJzdCBjb21wYW55IHRvIHNoaXAgcGFpbnRzIGFuZCBjb2F0aW5ncyBhY3Jvc3MgdGhlIFVuaXRlZCBTdGF0ZXM8L2xpPjxsaT5GaXJzdCBlbXBsb3llZSwgZGV2ZWxvcGVkIGNvbXBhbnkgdG8gMisgbWlsbGlvbiBpbiByZXZlbnVlIHdpdGggT3ZlcnR1cmUsIEdvb2dsZSBBZHdvcmRzIGFuZCBTRU88L2xpPjxsaT5DcmVhdGVkLCBtYXJrZXRlZCBhbmQgc3Vic2NyaWJlZCB2b2NhdGlvbmFsIHNjaG9vbCBmb3Igc3BlY2lhbHR5IGNvYXRpbmdzPC9saT48bGk+V29ya2VkIHdpdGggdG9wIEl0YWxpYW4gcGFpbnQgbWFudWZhY3R1cmVycyBvdmVyc2VhcyB0byBidWlsZCBleGNsdXNpdmUgZGlzdHJpYnV0aW9uIHJpZ2h0czwvbGk+PC91bD48L2Rpdj48L2Rpdj48YnIvPjxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwibGFyZ2UtMTIgY29sdW1uc1wiPjxoNj5TRVBURU1CRVIgMjAwMCAtIE1BWSAyMDAyPC9oNj48YnIvPjxoMj5FZHVjYXRpb248L2gyPjxici8+PHA+U2VsZiBlZHVjYXRlZCBkZXNpZ25lci9wcm9ncmFtbWVyIHdpdGggdm9jYXRpb25hbCB0cmFpbmluZy4gPC9wPjxwPjxzdHJvbmc+Q2VydGlmaWNhdGlvbnM8L3N0cm9uZz48YnIvPmlORVQrLCBBKyBDZXJ0aWZpY2F0aW9uIDwvcD48cD48c3Ryb25nPkFwcHJlbnRpY2VzaGlwPC9zdHJvbmc+PGJyLz5ZZWFyIGxvbmcgcGVyc29uYWwgYXBwcmVudGljZXNoaXAgd2l0aCBmaXJzdCBlbmdpbmVlciBhdCBBbWF6b24uY29tPC9wPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2Pjxici8+PGJyLz4nXG5cbkZyYW5jaGluby5jb250cm9sbGVyICdKb2JUYXBjZW50aXZlQ3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdKb2JUYXBjZW50aXZlVHdvQ3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdKb2JDcGdpb0N0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSm9iTWVkeWNhdGlvbkN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSm9iQ3N0Q3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdKb2JLb3VwbkN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSm9iTWVkeWNhdGlvbkN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSm9iTWVkeWNhdGlvbkN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSm9iVHJvdW5kQ3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdKb2JNb250aGx5c09uZUN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnSm9iTW9udGhseXNUd29DdHJsJywgKCRzY29wZSkgLT5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0pvYkJlbmNocHJlcEN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnQ29udGFjdEN0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnRGV2ZWxvcGVyc0N0cmwnLCAoJHNjb3BlKSAtPlxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnRGV2ZWxvcGVyQ2VudGVyQ3RybCcsICgkc2NvcGUpIC0+XG5cbkZyYW5jaGluby5jb250cm9sbGVyICdEb2NzQ3RybCcsICgkc2NvcGUsIERvY3MpIC0+XG4gICRzY29wZS4kd2F0Y2ggKC0+IERvY3MubGlzdCksIC0+XG4gICAgJHNjb3BlLmRvY3MgPSBEb2NzLmxpc3RcblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0RvY0N0cmwnLCAoJHNjb3BlLCAkc2NlLCAkc3RhdGVQYXJhbXMsICR0aW1lb3V0LCBEb2NzKSAtPlxuICAkc2NvcGUuaW5kZXggPSBpZiAkc3RhdGVQYXJhbXMuc3RlcCB0aGVuICRzdGF0ZVBhcmFtcy5zdGVwLTEgZWxzZSAwXG5cbiAgJHNjb3BlLiR3YXRjaCAoLT4gRG9jcy5saXN0KSwgLT5cbiAgICAkc2NvcGUuZG9jID0gRG9jcy5maW5kKCRzdGF0ZVBhcmFtcy5wZXJtYWxpbmspXG4gICAgaWYgJHNjb3BlLmRvY1xuICAgICAgJHNjb3BlLnN0ZXAgPSAkc2NvcGUuZG9jLnN0ZXBzWyRzY29wZS5pbmRleF1cbiAgICAgICRzY29wZS5zdGVwLnVybCA9ICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKCRzY29wZS5zdGVwLnVybClcblxuICAgICAgaWYgJHNjb3BlLnN0ZXAudHlwZSA9PSAnZGlhbG9nJ1xuICAgICAgICAkc2NvcGUubWVzc2FnZUluZGV4ID0gMFxuICAgICAgICAkc2NvcGUubWVzc2FnZXMgPSBbXVxuICAgICAgICAkdGltZW91dCgkc2NvcGUubmV4dE1lc3NhZ2UsIDEwMDApXG5cbiAgJHNjb3BlLmhhc01vcmVTdGVwcyA9IC0+XG4gICAgaWYgJHNjb3BlLnN0ZXBcbiAgICAgICRzY29wZS5zdGVwLmluZGV4IDwgJHNjb3BlLmRvYy5zdGVwcy5sZW5ndGhcblxuRnJhbmNoaW5vLmRpcmVjdGl2ZSAnbXlTbGlkZXNob3cnLCAtPlxuICByZXN0cmljdDogJ0FDJ1xuICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSAtPlxuICAgIGNvbmZpZyA9IGFuZ3VsYXIuZXh0ZW5kKFxuICAgICAgc2xpZGVzOiAnLnNsaWRlJyxcbiAgICBzY29wZS4kZXZhbChhdHRycy5teVNsaWRlc2hvdykpXG4gICAgc2V0VGltZW91dCAoLT5cbiAgICAgICQoZWxlbWVudCkuY3ljbGUgLT5cbiAgICAgICAgZng6ICAgICAnZmFkZScsXG4gICAgICAgIHNwZWVkOiAgJ2Zhc3QnLFxuICAgICAgICBuZXh0OiAgICcjbmV4dDInLFxuICAgICAgICBwcmV2OiAgICcjcHJldjInLFxuICAgICAgICBjYXB0aW9uOiAnI2FsdC1jYXB0aW9uJyxcbiAgICAgICAgY2FwdGlvbl90ZW1wbGF0ZTogJ3t7aW1hZ2VzLmFsdH19JyxcbiAgICAgICAgcGF1c2Vfb25faG92ZXI6ICd0cnVlJ1xuXG4gICAgKSwgMFxuIiwiQVVUSDBfQ0xJRU5UX0lEID0gJ0ExMjZYV2RKWlk3MTV3M0I2eVZDZXZwUzh0WW1QSnJqJ1xuQVVUSDBfRE9NQUlOID0gJ2Zvb3Ricm9zLmF1dGgwLmNvbSdcbkFVVEgwX0NBTExCQUNLX1VSTCA9IGxvY2F0aW9uLmhyZWYiLCJ3aW5kb3cuRnJhbmNoaW5vID0gYW5ndWxhci5tb2R1bGUoJ3RhcC5jb250cm9sbGVycycsIFtdKVxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnTG9naW5DdHJsJywgKCRzY29wZSwgYXV0aCwgJHN0YXRlLCBzdG9yZSkgLT5cblxuICBkb0F1dGggPSAtPlxuICAgIGF1dGguc2lnbmluIHtcbiAgICAgIGNsb3NhYmxlOiBmYWxzZVxuICAgICAgYXV0aFBhcmFtczogc2NvcGU6ICdvcGVuaWQgb2ZmbGluZV9hY2Nlc3MnXG4gICAgfVxuICAgIHJldHVyblxuXG4gICRzY29wZS4kb24gJyRpb25pYy5yZWNvbm5lY3RTY29wZScsIC0+XG4gICAgZG9BdXRoKClcbiAgICByZXR1cm5cbiAgZG9BdXRoKClcbiAgcmV0dXJuXG5cblxuRnJhbmNoaW5vLmNvbnRyb2xsZXIgJ0ludHJvQ3RybCcsICgkc2NvcGUsICRzdGF0ZSwgJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZSkgLT5cbiAgJHNjb3BlLnN0YXJ0QXBwID0gLT5cbiAgICAkc3RhdGUuZ28oJ2FwcC5wcm9kdWN0cycpXG5cbiAgJHNjb3BlLm5leHQgPSAtPlxuICAgICRpb25pY1NsaWRlQm94RGVsZWdhdGUubmV4dCgpXG5cbiAgJHNjb3BlLnByZXZpb3VzID0gLT5cbiAgICAkaW9uaWNTbGlkZUJveERlbGVnYXRlLnByZXZpb3VzKClcblxuXG4gICRzY29wZS5zbGlkZUNoYW5nZWQgPSAoaW5kZXgpIC0+XG4gICAgJHNjb3BlLnNsaWRlSW5kZXggPSBpbmRleFxuXG4gIHJldHVyblxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnQXBwQ3RybCcsICgkc2NvcGUpIC0+XG4gICMgV2l0aCB0aGUgbmV3IHZpZXcgY2FjaGluZyBpbiBJb25pYywgQ29udHJvbGxlcnMgYXJlIG9ubHkgY2FsbGVkXG4gICMgd2hlbiB0aGV5IGFyZSByZWNyZWF0ZWQgb3Igb24gYXBwIHN0YXJ0LCBpbnN0ZWFkIG9mIGV2ZXJ5IHBhZ2UgY2hhbmdlLlxuICAjIFRvIGxpc3RlbiBmb3Igd2hlbiB0aGlzIHBhZ2UgaXMgYWN0aXZlIChmb3IgZXhhbXBsZSwgdG8gcmVmcmVzaCBkYXRhKSxcbiAgIyBsaXN0ZW4gZm9yIHRoZSAkaW9uaWNWaWV3LmVudGVyIGV2ZW50OlxuICAjJHNjb3BlLiRvbignJGlvbmljVmlldy5lbnRlcicsIGZ1bmN0aW9uKGUpIHtcbiAgI30pO1xuICByZXR1cm5cblxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnRGFzaEN0cmwnLCAoJHNjb3BlLCAkaHR0cCkgLT5cblxuICAkc2NvcGUuY2FsbEFwaSA9IC0+XG4gICAgIyBKdXN0IGNhbGwgdGhlIEFQSSBhcyB5b3UnZCBkbyB1c2luZyAkaHR0cFxuICAgICRodHRwKFxuICAgICAgdXJsOiAnaHR0cDovL2F1dGgwLW5vZGVqc2FwaS1zYW1wbGUuaGVyb2t1YXBwLmNvbS9zZWN1cmVkL3BpbmcnXG4gICAgICBtZXRob2Q6ICdHRVQnKS50aGVuICgtPlxuICAgICAgYWxlcnQgJ1dlIGdvdCB0aGUgc2VjdXJlZCBkYXRhIHN1Y2Nlc3NmdWxseSdcbiAgICAgIHJldHVyblxuICAgICksIC0+XG4gICAgICBhbGVydCAnUGxlYXNlIGRvd25sb2FkIHRoZSBBUEkgc2VlZCBzbyB0aGF0IHlvdSBjYW4gY2FsbCBpdC4nXG4gICAgICByZXR1cm5cbiAgICByZXR1cm5cblxuICByZXR1cm5cblxuIyAtLS1cbiMgZ2VuZXJhdGVkIGJ5IGpzMmNvZmZlZSAyLjAuNFxuIiwiYW5ndWxhci5tb2R1bGUoXCJ0YXAuZGlyZWN0aXZlc1wiLCBbXSlcbiAgLmRpcmVjdGl2ZSBcImRldmljZVwiLCAtPlxuICAgIHJlc3RyaWN0OiBcIkFcIlxuICAgIGxpbms6IC0+XG4gICAgICBkZXZpY2UuaW5pdCgpXG5cbiAgLnNlcnZpY2UgJ2NvcHknLCAoJHNjZSkgLT5cbiAgICBjb3B5ID1cbiAgICAgIGFib3V0OlxuICAgICAgICBoZWFkaW5nOiBcIldlJ3JlIDxzdHJvbmc+dGFwcGluZzwvc3Ryb25nPiBpbnRvIHRoZSBmdXR1cmVcIlxuICAgICAgICBzdWJfaGVhZGluZzogXCJUYXBjZW50aXZlIHdhcyBjcmVhdGVkIGJ5IGEgdGVhbSB0aGF0IGhhcyBsaXZlZCB0aGUgbW9iaWxlIGNvbW1lcmNlIHJldm9sdXRpb24gZnJvbSB0aGUgZWFybGllc3QgZGF5cyBvZiBtQ29tbWVyY2Ugd2l0aCBXQVAsIHRvIGxlYWRpbmcgdGhlIGNoYXJnZSBpbiBtb2JpbGUgcGF5bWVudHMgYW5kIHNlcnZpY2VzIHdpdGggTkZDIHdvcmxkd2lkZS5cIlxuICAgICAgICBjb3B5OiBcIjxwPkZvciB1cywgbW9iaWxlIGNvbW1lcmNlIGhhcyBhbHdheXMgYmVlbiBhYm91dCBtdWNoIG1vcmUgdGhhbiBwYXltZW50OiAgbWFya2V0aW5nLCBwcm9tb3Rpb25zLCBwcm9kdWN0IGNvbnRlbnQsIGFuZCBsb3lhbHR5LCBhbGwgY29tZSB0byBsaWZlIGluc2lkZSBhIG1vYmlsZSBwaG9uZS4gTW9iaWxlIGNvbW1lcmNlIHJlYWxseSBnZXRzIGludGVyZXN0aW5nIHdoZW4gaXQgYnJpZGdlcyB0aGUgZGlnaXRhbCBhbmQgcGh5c2ljYWwgd29ybGRzLjwvcD48cD5PdXIgZ29hbCBhdCBUYXBjZW50aXZlIGlzIHRvIGNyZWF0ZSBhIHN0YXRlLW9mLXRoZS1hcnQgbW9iaWxlIGVuZ2FnZW1lbnQgcGxhdGZvcm0gdGhhdCBlbmFibGVzIG1hcmtldGVycyBhbmQgZGV2ZWxvcGVycyB0byBjcmVhdGUgZW50aXJlbHkgbmV3IGN1c3RvbWVyIGV4cGVyaWVuY2VzIGluIHBoeXNpY2FsIGxvY2F0aW9ucyDigJMgYWxsIHdpdGggYSBtaW5pbXVtIGFtb3VudCBvZiB0ZWNobm9sb2d5IGRldmVsb3BtZW50LjwvcD48cD5XZSB0aGluayB5b3XigJlsbCBsaWtlIHdoYXQgd2XigJl2ZSBidWlsdCBzbyBmYXIuIEFuZCBqdXN0IGFzIG1vYmlsZSB0ZWNobm9sb2d5IGlzIGNvbnN0YW50bHkgZXZvbHZpbmcsIHNvIGlzIHRoZSBUYXBjZW50aXZlIHBsYXRmb3JtLiBHaXZlIGl0IGEgdGVzdCBkcml2ZSB0b2RheS48L3A+XCJcbiAgICAgIHRlYW06XG4gICAgICAgIGhlYWRpbmc6IFwiXCJcbiAgICAgICAgYmlvczpcbiAgICAgICAgICBkYXZlX3JvbGU6IFwiXCJcbiAgICAgICAgICBkYXZlX2NvcHk6IFwiXCJcbiAgICBcblxuXG4gICAgdHJ1c3RWYWx1ZXMgPSAodmFsdWVzKSAtPlxuICAgICAgXy5lYWNoIHZhbHVlcywgKHZhbCwga2V5KSAtPlxuICAgICAgICBzd2l0Y2ggdHlwZW9mKHZhbClcbiAgICAgICAgICB3aGVuICdzdHJpbmcnXG4gICAgICAgICAgICAkc2NlLnRydXN0QXNIdG1sKHZhbClcbiAgICAgICAgICB3aGVuICdvYmplY3QnXG4gICAgICAgICAgICB0cnVzdFZhbHVlcyh2YWwpXG5cbiAgICB0cnVzdFZhbHVlcyhjb3B5KVxuXG4gICAgY29weVxuIiwiaWYgZGV2aWNlLmRlc2t0b3AoKVxuXG5lbHNlIGlmIGRldmljZS5tb2JpbGUoKVxuXG5cdCQgPSBkb2N1bWVudCAjIHNob3J0Y3V0XG5cdGNzc0lkID0gJ215Q3NzJyAjIHlvdSBjb3VsZCBlbmNvZGUgdGhlIGNzcyBwYXRoIGl0c2VsZiB0byBnZW5lcmF0ZSBpZC4uXG5cdGlmICEkLmdldEVsZW1lbnRCeUlkKGNzc0lkKVxuXHQgICAgaGVhZCAgPSAkLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF1cblx0ICAgIGxpbmsgID0gJC5jcmVhdGVFbGVtZW50KCdsaW5rJylcblx0ICAgIGxpbmsuaWQgICA9IGNzc0lkXG5cdCAgICBsaW5rLnJlbCAgPSAnc3R5bGVzaGVldCdcblx0ICAgIGxpbmsudHlwZSA9ICd0ZXh0L2Nzcydcblx0ICAgIGxpbmsuaHJlZiA9ICcvY3NzL2lvbmljLmFwcC5taW4uY3NzJ1xuXHQgICAgbGluay5tZWRpYSA9ICdhbGwnXG5cdCAgICBoZWFkLmFwcGVuZENoaWxkKGxpbmspXG4iLCJ3aW5kb3cuRnJhbmNoaW5vID0gYW5ndWxhci5tb2R1bGUoJ3RhcC5wcm9kdWN0JywgW10pXG5cbkZyYW5jaGluby5mYWN0b3J5ICdQcm9kdWN0JywgKCRodHRwLCAkcm9vdFNjb3BlKSAtPlxuICB7IGFsbDogKHF1ZXJ5U3RyaW5nKSAtPlxuICAgICRodHRwLmdldCAkcm9vdFNjb3BlLnNlcnZlciArICcvcHJvZHVjdHMnLCBwYXJhbXM6IHF1ZXJ5U3RyaW5nXG4gfVxuXG5GcmFuY2hpbm8uY29udHJvbGxlciAnUHJvZHVjdExpc3RDdHJsJywgKCRzY29wZSwgJHJvb3RTY29wZSwgJGlvbmljU2Nyb2xsRGVsZWdhdGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsIFByb2R1Y3QpIC0+XG4gICRzY29wZS5wcm9kdWN0cyA9IFtdXG4gIHBhZ2VTaXplID0gMjBcbiAgcHJvZHVjdENvdW50ID0gMVxuICBwYWdlID0gMFxuXG4gICRzY29wZS5jbGVhclNlYXJjaCA9IC0+XG4gICAgJHNjb3BlLnNlYXJjaEtleSA9ICcnXG4gICAgJHNjb3BlLmxvYWREYXRhKClcbiAgICByZXR1cm5cblxuICAkcm9vdFNjb3BlLiRvbiAnc2VhcmNoS2V5Q2hhbmdlJywgKGV2ZW50LCBzZWFyY2hLZXkpIC0+XG4gICAgJHNjb3BlLnNlYXJjaEtleSA9IHNlYXJjaEtleVxuICAgICRzY29wZS5sb2FkRGF0YSgpXG4gICAgcmV0dXJuXG5cbiAgJHNjb3BlLmZvcm1hdEFsY29ob2xMZXZlbCA9ICh2YWwpIC0+XG4gICAgcGFyc2VGbG9hdCB2YWxcblxuICAkc2NvcGUubG9hZERhdGEgPSAtPlxuICAgIHBhZ2UgPSAxXG4gICAgcmFuZ2UgPSAxXG4gICAgUHJvZHVjdC5hbGwoXG4gICAgICBzZWFyY2g6ICRzY29wZS5zZWFyY2hLZXlcbiAgICAgIG1pbjogcmFuZ2VbMF1cbiAgICAgIG1heDogcmFuZ2VbMV1cbiAgICAgIHBhZ2U6IHBhZ2VcbiAgICAgIHBhZ2VTaXplOiBwYWdlU2l6ZSkuc3VjY2VzcyAocmVzdWx0KSAtPlxuICAgICAgJHNjb3BlLnByb2R1Y3RzID0gcmVzdWx0LnByb2R1Y3RzXG4gICAgICBwcm9kdWN0Q291bnQgPSByZXN1bHQudG90YWxcbiAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLiRnZXRCeUhhbmRsZSgnbXlTY3JvbGwnKS5nZXRTY3JvbGxWaWV3KCkuc2Nyb2xsVG8gMCwgMCwgdHJ1ZVxuICAgICAgJHNjb3BlLiRicm9hZGNhc3QgJ3Njcm9sbC5pbmZpbml0ZVNjcm9sbENvbXBsZXRlJ1xuICAgICAgcmV0dXJuXG4gICAgcmV0dXJuXG5cbiAgJHNjb3BlLmxvYWRNb3JlRGF0YSA9IC0+XG4gICAgcGFnZSsrXG4gICAgcmFuZ2UgPSAxXG4gICAgUHJvZHVjdC5hbGwoXG4gICAgICBzZWFyY2g6ICRzY29wZS5zZWFyY2hLZXlcbiAgICAgIG1pbjogcmFuZ2VbMF1cbiAgICAgIG1heDogcmFuZ2VbMV1cbiAgICAgIHBhZ2U6IHBhZ2VcbiAgICAgIHBhZ2VTaXplOiBwYWdlU2l6ZSkuc3VjY2VzcyAocmVzdWx0KSAtPlxuICAgICAgcHJvZHVjdENvdW50ID0gcmVzdWx0LnRvdGFsXG4gICAgICBBcnJheTo6cHVzaC5hcHBseSAkc2NvcGUucHJvZHVjdHMsIHJlc3VsdC5wcm9kdWN0c1xuICAgICAgJHNjb3BlLiRicm9hZGNhc3QgJ3Njcm9sbC5pbmZpbml0ZVNjcm9sbENvbXBsZXRlJ1xuICAgICAgcmV0dXJuXG4gICAgcmV0dXJuXG5cbiAgJHNjb3BlLmlzTW9yZURhdGEgPSAtPlxuICAgIHBhZ2UgPCBwcm9kdWN0Q291bnQgLyBwYWdlU2l6ZVxuXG4gIHJldHVyblxuXG5cbkZyYW5jaGluby5jb250cm9sbGVyICdQcm9kdWN0RGV0YWlsQ3RybCcsICgkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkc2NlLCBQcm9kdWN0LCAkaW9uaWNIaXN0b3J5KSAtPlxuICBcbiAgJHNjb3BlLm15R29CYWNrID0gLT5cbiAgICAkaW9uaWNIaXN0b3J5LmdvQmFjaygpXG4gICAgcmV0dXJuXG5cbiAgJHNjb3BlLnByb2R1Y3QgPVxuICAgIG5hbWU6ICRzdGF0ZVBhcmFtcy5uYW1lXG4gICAgYnJld2VyeTogJHN0YXRlUGFyYW1zLmJyZXdlcnlcbiAgICBhbGNvaG9sOiAkc3RhdGVQYXJhbXMuYWxjb2hvbFxuICAgIHZpZGVvOiAkc3RhdGVQYXJhbXMudmlkZW9cbiAgICB0YWdzOiAkc3RhdGVQYXJhbXMudGFnc1xuICAkc2NvcGUudGFncyA9ICRzY29wZS5wcm9kdWN0LnRhZ3Muc3BsaXQoJywgJylcblxuICAkc2NvcGUuc2V0U2VhcmNoS2V5ID0gKHNlYXJjaEtleSkgLT5cbiAgICAkcm9vdFNjb3BlLiRlbWl0ICdzZWFyY2hLZXlDaGFuZ2UnLCBzZWFyY2hLZXlcbiAgICAkc3RhdGUuZ28gJ3Byb2R1Y3RzJ1xuICAgIHJldHVyblxuXG4gICRzY29wZS5mb3JtYXRBbGNvaG9sTGV2ZWwgPSAodmFsKSAtPlxuICAgICcnICsgcGFyc2VGbG9hdCh2YWwpICsgJyUnXG5cbiAgJHNjb3BlLmZvcm1hdFlvdXR1YmVVcmwgPSAodmFsKSAtPlxuICAgICRzY29wZS5jdXJyZW50VXJsID0gJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLycgKyB2YWwgKyAnJ1xuICAgICRzY29wZS5iZXR0ZXJVcmwgPSAkc2NlLnRydXN0QXNSZXNvdXJjZVVybCgkc2NvcGUuY3VycmVudFVybClcbiAgICAkc2NvcGUuYmV0dGVyVXJsXG5cbiAgcmV0dXJuXG5cbiMgLS0tXG4jIGdlbmVyYXRlZCBieSBqczJjb2ZmZWUgMi4wLjQiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=