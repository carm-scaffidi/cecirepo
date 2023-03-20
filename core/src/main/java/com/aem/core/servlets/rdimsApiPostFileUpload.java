/** 
 * <h2>  </h2> 
 * This program implements an application 
 * to perform operation submit file from (Client Web Browser  
 * save into RDMIS using RDMIS Web_API
 * <p>  
 * @author Asim Khan  
 * @version 1.0 
 * @since 24-09-2021 
 */  
package com.aem.core.servlets;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.util.Map;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.servlet.Servlet;

import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.fileupload.util.Streams;
import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


//Servlet for uploading file
@Component(service = Servlet.class, property = { "sling.servlet.methods=" + HttpConstants.METHOD_POST,
		"sling.servlet.paths=/bin/rdimsApiPostFileUpload" })
public class rdimsApiPostFileUpload extends SlingAllMethodsServlet {

	private static final Logger logger = LoggerFactory.getLogger(rdimsApiPostFileUpload.class);
	private static final String USER_AGENT = "Mozilla/5.0";

	//"https://gccasewebapi/rdims/"; //<<<---PRD ONLY
	//	private static final String POST_FILE_URL = "https://gccasewebapi/rdims/api/RDIMS/addnewdocument/?lang=en";

	//"https://gccasewebapi-dev/rdims/"; //<<<---localhost, dev05, dev06 & pPRD
	private static final String POST_FILE_URL = "https://gccasewebapi-dev/rdims/api/RDIMS/addnewdocument/?lang=en";
	
	
	protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) {
	
	String charset = "UTF-8";
		logger.debug("inside FileUploadServlet");
		try {
			if (ServletFileUpload.isMultipartContent(request)) {
				Map<String, RequestParameter[]> requestParameters = request.getRequestParameterMap();
				MultipartEntityBuilder builder = MultipartEntityBuilder.create();         
				builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);	
		        
				for (final Map.Entry<String, RequestParameter[]> entry : requestParameters.entrySet()) {
					String formField = entry.getKey();
					RequestParameter[] pArr = entry.getValue();
					RequestParameter param = pArr[0];
					InputStream stream = param.getInputStream();
					if (param.isFormField()) {
						logger.info("Form field {} with value {} detected", formField, Streams.asString(stream));
						builder.addTextBody(formField, param.getString(),ContentType.DEFAULT_TEXT);
					} else {
						logger.info("File field {} with file name {} detected", formField, param.getFileName());
				
						builder.addBinaryBody(param.getFileName(), stream,ContentType.DEFAULT_BINARY,param.getFileName());
					}
				}
				String responseBody = executePOST(builder,POST_FILE_URL);
				response.getWriter().write(responseBody);				
			}
		} catch (Exception e) {
			logger.error("Something went wrong");

		}
	}
	
	
	
	private String executePOST(MultipartEntityBuilder builder, String serviceURL) throws ClientProtocolException, IOException, KeyManagementException, NoSuchAlgorithmException {
		
		String responseBody = "";
		// Start Handle the certificate
		// Create a trust manager that does not validate certificate chains
		TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
			public java.security.cert.X509Certificate[] getAcceptedIssuers() {
				return null;
			}

			public void checkClientTrusted(X509Certificate[] certs, String authType) {
			}

			public void checkServerTrusted(X509Certificate[] certs, String authType) {
			}
		} };

		SSLContext sc;
		sc = SSLContext.getInstance("SSL");
		sc.init(null, trustAllCerts, new java.security.SecureRandom());

		// Create all-trusting host name verifier
		HostnameVerifier allHostsValid = new HostnameVerifier() {
			public boolean verify(String hostname, SSLSession session) {
				return true;
			}
		};
		// end handle the certificate

		// Creating HttpClientBuilder
		HttpClientBuilder clientbuilder = HttpClients.custom();
		// Creating SSLConnectionSocketFactory object
		SSLConnectionSocketFactory sslConSocFactory = new SSLConnectionSocketFactory(sc, new NoopHostnameVerifier());

		// Setting the SSLConnectionSocketFactory
		clientbuilder = clientbuilder.setSSLSocketFactory(sslConSocFactory);

		try (CloseableHttpClient client = clientbuilder.build()) {
			HttpEntity entityData = builder.build();
			// build http request and assign multipart upload data
			//uncomment below to print data sent to server

			/*ByteArrayOutputStream bytes = new ByteArrayOutputStream();
			entityData.writeTo(bytes);
			String content = bytes.toString();*/
			
            HttpUriRequest request = RequestBuilder.post(serviceURL).setEntity(entityData).build();

            System.out.println("Executing request " + request.getRequestLine());

            // Create a custom response handler
            ResponseHandler < String > responseHandler = response -> {
                int status = response.getStatusLine().getStatusCode();
                if (status >= 200 && status < 300) {
                    HttpEntity entity = response.getEntity();
                    return entity != null ? EntityUtils.toString(entity) : null;
                } else {
                    throw new ClientProtocolException("Unexpected response status: " + status);
                }
            };
            responseBody = client.execute(request, responseHandler);
            
            logger.info(responseBody);
        }
		return responseBody;
    }	
    }
