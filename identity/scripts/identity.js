(function() {
  const SELECTOR_HEADER_SEARCH = "header > nav > .md-search";
  const SELECTOR_SIDEBAR_MENU = ".md-sidebar ul.md-nav__list";

  const CLASS_NAV_ITEM = "md-nav__item";
  const CLASS_NAV_LINK = "md-nav__link";
  const CLASS_IDENTITY_NAV_LINK = "md-nav__link--identity";
  const CLASS_HEADER_IDENTITY = "md-header__identity";
  const CLASS_ELLIPSIS = "md-ellipsis";

  const ACTION_REGISTER = "register";
  const ACTION_LOG_IN = "login";

  const LABEL_REGISTER = "Register";
  const LABEL_LOG_IN = "Log In";

  const TAB_LOGIN = "login";
  const TAB_SIGNUP = "signup";

  const PARAM_RETURN_URL = "returnUrl";
  const PARAM_ACTION = "action";

  function createLink(label, action) {
    const link = document.createElement("a");
    link.classList.add(CLASS_NAV_LINK);
    link.classList.add(CLASS_IDENTITY_NAV_LINK);
    link.href = "#";
    link.addEventListener("click", action);

    const span = document.createElement("span");
    span.innerText = label;
    span.classList.add(CLASS_ELLIPSIS);
    link.appendChild(span);

    return link;
  }

  function createRegisterLink() {
    return createLink(LABEL_REGISTER, (e) => {
      e.preventDefault();
      registerUser();
    });
  }

  function createLogInLink() {
    return createLink(LABEL_LOG_IN, (e) => {
      e.preventDefault();
      logInUser();
    });
  }

  function addIdentityLinks(parent) {
    const registerLink = createRegisterLink();
    parent.appendChild(registerLink);

    const textNode = document.createTextNode("|");
    parent.appendChild(textNode);

    const logInLink = createLogInLink();
    parent.appendChild(logInLink);

    return parent;
  }

  function createHeaderNavItem() {
    const navItem = document.createElement("div");
    navItem.classList.add(CLASS_HEADER_IDENTITY);
    return addIdentityLinks(navItem);
  }

  function createSidebarNavItem() {
    const navItem = document.createElement("li");
    navItem.classList.add(CLASS_NAV_ITEM);
    return addIdentityLinks(navItem);
  }

  function createIdentityUI() {
    const search = document.querySelector(SELECTOR_HEADER_SEARCH);
    if (search) {
      search.parentNode.insertBefore(createHeaderNavItem(), search);
    }

    const sidebarNav = document.querySelector(SELECTOR_SIDEBAR_MENU);
    if (sidebarNav) {
      sidebarNav.appendChild(createSidebarNavItem());
    }
  }

  function registerUser() {
    netlifyIdentity.open(TAB_SIGNUP);
  }

  function logInUser() {
    netlifyIdentity.open(TAB_LOGIN);
  }

  function handleActionParameter(action) {
    switch (action) {
      case ACTION_REGISTER:
        registerUser();
        break;
      case ACTION_LOG_IN:
        logInUser();
        break;
    }
  }

  function handleReturnUrl() {
    const params = new URLSearchParams(window.location.search);
    const user = netlifyIdentity.currentUser();
    const returnUrl = params.get(PARAM_RETURN_URL)
    if (user && returnUrl) {
      window.location.href = returnUrl;
    }
  }

  function handleUrlParameters() {
    handleReturnUrl();

    const user = netlifyIdentity.currentUser();
    if (!user) {
      const params = new URLSearchParams(window.location.search);
      const action = params.get(PARAM_ACTION);
      if (action) {
        handleActionParameter(action);
      }
    }
  }

  function setupIdentityEvents() {
    netlifyIdentity.on("login", handleReturnUrl);
  }

  netlifyIdentity.init();
  createIdentityUI();
  setupIdentityEvents();
  handleUrlParameters();
})();
