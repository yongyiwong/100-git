'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">100bet documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-6f1b628d6c95d34a7a7259000c35609c"' : 'data-target="#xs-components-links-module-AppModule-6f1b628d6c95d34a7a7259000c35609c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-6f1b628d6c95d34a7a7259000c35609c"' :
                                            'id="xs-components-links-module-AppModule-6f1b628d6c95d34a7a7259000c35609c"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavigationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NavigationComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CasinoModule.html" data-type="entity-link">CasinoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CasinoModule-ab382515ae1a60cc654464ea275426f8"' : 'data-target="#xs-components-links-module-CasinoModule-ab382515ae1a60cc654464ea275426f8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CasinoModule-ab382515ae1a60cc654464ea275426f8"' :
                                            'id="xs-components-links-module-CasinoModule-ab382515ae1a60cc654464ea275426f8"' }>
                                            <li class="link">
                                                <a href="components/CasinoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CasinoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CasinoRoutingModule.html" data-type="entity-link">CasinoRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HomeModule.html" data-type="entity-link">HomeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HomeModule-60b2a88f7237bc656c935cdbba1b4ae5"' : 'data-target="#xs-components-links-module-HomeModule-60b2a88f7237bc656c935cdbba1b4ae5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HomeModule-60b2a88f7237bc656c935cdbba1b4ae5"' :
                                            'id="xs-components-links-module-HomeModule-60b2a88f7237bc656c935cdbba1b4ae5"' }>
                                            <li class="link">
                                                <a href="components/AsianHandicapComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AsianHandicapComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CarouselComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CarouselComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CarouselCounterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CarouselCounterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CasinoGamesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CasinoGamesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FeaturedComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FeaturedComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FixturesMatchesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FixturesMatchesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FixturesOutrightsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FixturesOutrightsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FixturesPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FixturesPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FixturesStandingsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FixturesStandingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InPlayBannerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InPlayBannerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InPlayComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InPlayComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InPlayPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InPlayPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LiveEventComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LiveEventComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MatchResultsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MatchResultsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PopularBetsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PopularBetsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SportsPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SportsPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TotalGoalsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TotalGoalsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UpcomingComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UpcomingComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomeRoutingModule.html" data-type="entity-link">HomeRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-50d373aef50eab8d0f8415882636ae43"' : 'data-target="#xs-components-links-module-SharedModule-50d373aef50eab8d0f8415882636ae43"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-50d373aef50eab8d0f8415882636ae43"' :
                                            'id="xs-components-links-module-SharedModule-50d373aef50eab8d0f8415882636ae43"' }>
                                            <li class="link">
                                                <a href="components/BetColumnComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BetColumnComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BetSlipComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BetSlipComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BetSlipMultiComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BetSlipMultiComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BetSlipSettingsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BetSlipSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BetSlipSingleComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BetSlipSingleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BetSlipSystemComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BetSlipSystemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BreadcrumbsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BreadcrumbsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LeftColumnNavComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LeftColumnNavComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MyBetsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MyBetsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OhbSelectComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OhbSelectComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StakeNumpadComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StakeNumpadComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-SharedModule-50d373aef50eab8d0f8415882636ae43"' : 'data-target="#xs-pipes-links-module-SharedModule-50d373aef50eab8d0f8415882636ae43"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedModule-50d373aef50eab8d0f8415882636ae43"' :
                                            'id="xs-pipes-links-module-SharedModule-50d373aef50eab8d0f8415882636ae43"' }>
                                            <li class="link">
                                                <a href="pipes/BreadcrumbNamePipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BreadcrumbNamePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/MyBetsAllComponent.html" data-type="entity-link">MyBetsAllComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MyBetsCashOutComponent.html" data-type="entity-link">MyBetsCashOutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MyBetsLiveNowComponent.html" data-type="entity-link">MyBetsLiveNowComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MyBetsSettledComponent.html" data-type="entity-link">MyBetsSettledComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MyBetsUnsettledComponent.html" data-type="entity-link">MyBetsUnsettledComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AnimationsService.html" data-type="entity-link">AnimationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BetSlipService.html" data-type="entity-link">BetSlipService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ErrorService.html" data-type="entity-link">ErrorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HttpService.html" data-type="entity-link">HttpService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JsonService.html" data-type="entity-link">JsonService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SubscriptionsService.html" data-type="entity-link">SubscriptionsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TranslateFromJsonService.html" data-type="entity-link">TranslateFromJsonService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WindowService.html" data-type="entity-link">WindowService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/BetSlip.html" data-type="entity-link">BetSlip</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NewPick.html" data-type="entity-link">NewPick</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Pick.html" data-type="entity-link">Pick</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});