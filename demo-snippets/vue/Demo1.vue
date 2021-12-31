<template>
	<Page>
		<ActionBar>
			<NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
			<Label text="Demo 1" />
		</ActionBar>

		<StackLayout>
			<WebView :javascriptEnabled="true" ref="web" src="~/assets/www/index.html" />
		</StackLayout>
	</Page>
</template>

<script>
import { knownFolders } from '@nativescript/core';
import { WebViewInterface } from '@abbieben/webview-interface';
export default {
	mounted() {
		console.log(
			knownFolders
				.currentApp()
				.getFolder('www')
				.eachEntity((e) => console.log(e.name))
		);
		const webview = this.$refs.web.nativeView;
		const WVInterface = new WebViewInterface(webview);
		WVInterface.start().then(() => {
			WVInterface.runJSFunc('happy', { msg: 'okay' }, (data) => console.log(data));
		});
	}
};
</script>

<style lang="scss" scoped>
WebView {
	width: 100%;
	height: 100%;
}
</style>