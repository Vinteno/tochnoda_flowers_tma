import { emitEvent, isTMA, mockTelegramEnv } from '@tma.js/sdk-react'

// It is important, to mock the environment only for development purposes. When building the
// application, import.meta.env.DEV will become false, and the code inside will be tree-shaken,
// so you will not see it in your final bundle.
if (import.meta.env.DEV) {
  // eslint-disable-next-line antfu/no-top-level-await
  if (!await isTMA('complete')) {
    const themeParams = {
      accent_text_color: '#52a93d',
      bg_color: '#ffffff',
      button_color: '#52a93d',
      button_text_color: '#ffffff',
      destructive_text_color: '#e61919',
      header_bg_color: '#e6f2d9',
      hint_color: '#6a707c',
      link_color: '#52a93d',
      secondary_bg_color: '#e6f2d9',
      section_bg_color: '#ffffff',
      section_header_text_color: '#6a707c',
      subtitle_text_color: '#6a707c',
      text_color: '#22252a',
    } as const
    const noInsets = { left: 0, top: 0, bottom: 0, right: 0 } as const

    mockTelegramEnv({
      onEvent(e) {
        // Here you can write your own handlers for all known Telegram Mini Apps methods:
        // https://docs.telegram-mini-apps.com/platform/methods
        if (e.name === 'web_app_request_theme') {
          return emitEvent('theme_changed', { theme_params: themeParams })
        }
        if (e.name === 'web_app_request_viewport') {
          return emitEvent('viewport_changed', {
            height: window.innerHeight,
            width: window.innerWidth,
            is_expanded: true,
            is_state_stable: true,
          })
        }
        if (e.name === 'web_app_request_content_safe_area') {
          return emitEvent('content_safe_area_changed', noInsets)
        }
        if (e.name === 'web_app_request_safe_area') {
          return emitEvent('safe_area_changed', noInsets)
        }
      },
      launchParams: new URLSearchParams([
        // Discover more launch parameters:
        // https://docs.telegram-mini-apps.com/platform/launch-parameters#parameters-list
        ['tgWebAppThemeParams', JSON.stringify(themeParams)],
        // Your init data goes here. Learn more about it here:
        // https://docs.telegram-mini-apps.com/platform/init-data#parameters-list
        //
        // Note that to make sure, you are using a valid init data, you must pass it exactly as it
        // is sent from the Telegram application. The reason is in case you will sort its keys
        // (auth_date, hash, user, etc.) or values your own way, init data validation will more
        // likely to fail on your server side. So, to make sure you are working with a valid init
        // data, it is better to take a real one from your application and paste it here. It should
        // look something like this (a correctly encoded URL search params):
        // ```
        // user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Egor%22%2C%22last_name%22...
        // ```
        // But in case you don't really need a valid init data, use this one:
        ['tgWebAppData', 'user=%7B%22id%22%3A958672640%2C%22first_name%22%3A%22%D0%95%D0%B3%D0%BE%D1%80%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22mrsterdy%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F5a5KQB26UZfG1YfAEAFs71PUx0KQztrXkKLG_Sg0QyY.svg%22%7D&chat_instance=3070572039673076496&chat_type=sender&auth_date=1769255670&signature=WU21ZvTJXhwaHX7Yc_ri4s5TFPvJ8XClwhKIoIUS_-PmvHDU3ioW1M7AtT9tt_7VZi5WSAZr21JQNBRPLHJvDw&hash=3f74d3fd19171ff61a6e8586e36c79db780523f0330b4a7256566044689f6562&tgWebAppVersion=9.1&tgWebAppPlatform=tdesktop&tgWebAppThemeParams={"accent_text_color":"#6ab2f2","bg_color":"#17212b","bottom_bar_bg_color":"#17212b","button_color":"#5288c1","button_text_color":"#ffffff","destructive_text_color":"#ec3942","header_bg_color":"#17212b","hint_color":"#708499","link_color":"#6ab3f3","secondary_bg_color":"#232e3c","section_bg_color":"#17212b","section_header_text_color":"#6ab3f3","section_separator_color":"#111921","subtitle_text_color":"#708499","text_color":"#f5f5f5"}'],
        ['tgWebAppVersion', '8.4'],
        ['tgWebAppPlatform', 'tdesktop'],
      ]),
    })

    console.warn(
      '⚠️ As long as the current environment was not considered as the Telegram-based one, it was mocked. Take a note, that you should not do it in production and current behavior is only specific to the development process. Environment mocking is also applied only in development mode. So, after building the application, you will not see this behavior and related warning, leading to crashing the application outside Telegram.',
    )
  }
}
