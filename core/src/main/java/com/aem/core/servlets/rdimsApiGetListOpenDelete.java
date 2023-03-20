package com.aem.core.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.servlet.Servlet;

import org.apache.http.HttpStatus;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.http.HttpHeaders;

//Servlet for Azure Searching
@Component(service = Servlet.class, property = { "sling.servlet.methods=" + HttpConstants.METHOD_GET,
		"sling.servlet.paths=/bin/rdimsApiGetListOpenDelete" })
public class rdimsApiGetListOpenDelete extends SlingAllMethodsServlet {

	private final Logger loggerSlf4j = LoggerFactory.getLogger(getClass());
	private static final String USER_AGENT = "Mozilla/5.0";

	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) {
		try {
			System.out.println(" bescob -inside rdmsapiServlet-stdout-Sep21");
			loggerSlf4j.debug("slf4j-bescob-getClass()");

			TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
				public java.security.cert.X509Certificate[] getAcceptedIssuers() {
					return null;
				}

				public void checkClientTrusted(X509Certificate[] certs, String authType) {
				}

				public void checkServerTrusted(X509Certificate[] certs, String authType) {
				}
			} };

			try {
				SSLContext sc;
				sc = SSLContext.getInstance("SSL");
				sc.init(null, trustAllCerts, new java.security.SecureRandom());

				HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
			} catch (NoSuchAlgorithmException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (KeyManagementException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			// Create all-trusting host name verifier
			HostnameVerifier allHostsValid = new HostnameVerifier() {
				public boolean verify(String hostname, SSLSession session) {
					return true;
				}
			};

			// String serviceURL = "https://gccasewebapi-dev/rdims/RDIMSDocument/documentListCRMData/?masterEntityId=3A5202CA-DA09-EC11-96B2-0050568116D9&appId=ceciacc";
			String wepApiUrl = request.getParameter("wepApiUrl");
			loggerSlf4j.debug("wepApiUrl" + wepApiUrl);

			String responseJson = executeGET(wepApiUrl); // (serviceURL);

			if (responseJson != null) {
				response.getWriter().write(responseJson.toString());
				response.getWriter().close();
			} else {
				response.setStatus(500);
			}

		} catch (Exception e) {
		}
	}

	private String executeGET(String url) throws IOException {

		StringBuffer resp = new StringBuffer();
		loggerSlf4j.debug("executeGET url: " + url);
		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		con.setRequestMethod("GET");
		con.setRequestProperty("User-Agent", USER_AGENT);

		// con.setRequestProperty("Content-type", "Application/JSON");

		int responseCode4 = con.getResponseCode();
		System.out.println("GET Response Code :: " + responseCode4);
		if (responseCode4 == HttpURLConnection.HTTP_OK) { // success
			loggerSlf4j.info("slf4j-executeGET-getClass():" + getClass());
			int a = con.getContentLength();
			System.out.println(" content length" + a);

			BufferedReader br = null;
			br = new BufferedReader(new InputStreamReader(con.getInputStream()));
			System.out.println("List Document:-- " + con.getInputStream().toString());

			String strCurrentLine;
			while ((strCurrentLine = br.readLine()) != null) {
				resp.append(strCurrentLine.toString());
			}
			System.out.println("resp: " + strCurrentLine);

		} else {
			System.out.println("GET request not worked");
		}
		return resp.toString();

	}

	@SuppressWarnings("unused")
	private JsonObject executeGETHHTP(String url) throws IOException {
		JsonObject json = null;
		try (CloseableHttpClient client = HttpClients.createDefault()) {
			final HttpGet httpget = new HttpGet(url);
			final CloseableHttpResponse httpResponse = client.execute(httpget);
			final int statusCode = httpResponse.getStatusLine().getStatusCode();
			if (statusCode == HttpStatus.SC_OK) {
				JsonElement element = new JsonParser()
						.parse(new InputStreamReader(httpResponse.getEntity().getContent()));
				json = element.getAsJsonObject();
				Gson gson = new GsonBuilder().setPrettyPrinting().create();
				String prettyJsonString = gson.toJson(json);
				// LOGGER.finer ("response returned from server" + prettyJsonString);
				return json;
			} else {
				// add failure logger
				return json;
			}
		}

	}

}
