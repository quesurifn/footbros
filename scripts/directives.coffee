angular.module("tap.directives", [])
  .directive "device", ->
    restrict: "A"
    link: ->
      device.init()

  .service 'copy', ($sce) ->
    copy =
      about:
        heading: "We're <strong>tapping</strong> into the future"
        sub_heading: "Tapcentive was created by a team that has lived the mobile commerce revolution from the earliest days of mCommerce with WAP, to leading the charge in mobile payments and services with NFC worldwide."
        copy: "<p>For us, mobile commerce has always been about much more than payment:  marketing, promotions, product content, and loyalty, all come to life inside a mobile phone. Mobile commerce really gets interesting when it bridges the digital and physical worlds.</p><p>Our goal at Tapcentive is to create a state-of-the-art mobile engagement platform that enables marketers and developers to create entirely new customer experiences in physical locations – all with a minimum amount of technology development.</p><p>We think you’ll like what we’ve built so far. And just as mobile technology is constantly evolving, so is the Tapcentive platform. Give it a test drive today.</p>"
      team:
        heading: ""
        bios:
          dave_role: ""
          dave_copy: ""
    


    trustValues = (values) ->
      _.each values, (val, key) ->
        switch typeof(val)
          when 'string'
            $sce.trustAsHtml(val)
          when 'object'
            trustValues(val)

    trustValues(copy)

    copy
