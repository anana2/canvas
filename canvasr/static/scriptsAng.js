class AppController {
  status = '';
  customFullscreen;
  constructor(private $scope, private $mdDialog, private $mdMedia, private $mdToast) {
    this.customFullscreen = this.$mdMedia('xs') || this.$mdMedia('sm');
  }

  showDialog(event) {
    var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs')) && this.customFullscreen;

    this.$mdDialog.show({
      controller: LoginDialogController,
      controllerAs: 'dialog',
      templateUrl: 'login-dialog.template.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      fullscreen: useFullScreen
    })
    .then(credentials => this.showToast(`Thanks for logging in, ${credentials.username}.`),
      () => this.showToast('You canceled the login.'));

    this.$scope.$watch(() => this.$mdMedia('xs') || this.$mdMedia('sm'),
      wantsFullScreen => this.customFullscreen = wantsFullScreen === true);
  }

  showToast(content: string) {
    this.$mdToast.show(
      this.$mdToast.simple()
        .content(content)
        .position('top right')
        .hideDelay(3000)
    );
  }
}

class LoginDialogController {
  username: string;
  password: string;

  constructor(private $mdDialog) { }

  hide() {
    this.$mdDialog.hide();
  }

  close() {
    this.$mdDialog.cancel();
  }

  login() {
    this.$mdDialog.hide();
    Login(this.username, this.password);
  }
}

function config($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('orange');
  $mdThemingProvider.theme('input', 'default')
    .primaryPalette('grey')
}

angular
  .module('app', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
  .controller('AppController', AppController)
  .config(config);
