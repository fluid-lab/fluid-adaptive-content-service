# fluid-adaptive-content-service
Repo for GSOC Project Described at https://wiki.fluidproject.org/display/fluid/Google+Summer+of+Code+2018+with+the+Fluid+Project#GoogleSummerofCode2018withtheFluidProject-Buildaserviceforadaptivecontentandlearningsupports

## Instructions to run the service locally
### Step 1 - Clone the Repository
### Step 2 - Install the required node modules
Run
```
npm install
```
### Step 3 - Setting API keys for services that require it
Currently, only *Oxford* is the service being used that requires API keys. You can create an account on [their site](https://developer.oxforddictionaries.com/) and acquire your free *API ID* and *API KEY* from there.
After acquiring the Id and Key, create a `.env` file looking like this
```
OXFORD_APP_ID=your_api_id_goes_here
OXFORD_APP_KEY=your_api_key_goes_here
```
### Step 4 - Start the service server
- **All Services together**\
When at the root of the repository, run
```
npm start
```
This will run all the endpoints, from all the services, at port 8080
- **Dictionary Service Server**\
When at the root of the repository, run
```
npm run dictionary
```
This will run all the dictionary service endpoints, at port 8081
- **NLP Service Server**\
When at the root of the repository, run
```
npm run nlp
```
This will run all the nlp service endpoints, at port 8082

When the server starts, it is ready to accept requests at the available endpoints.

Currently available endpoints - 
### Dictionary Service
- `http://localhost:8081/v1/dictionary/{language_code}/definition/{word}`\
**Method**: `GET`\
**Language Code**: English (en), French (fr) and German (de)

- `http://localhost:8081/v1/dictionary/{language_code}/synonyms/{word}`\
**Method**: `GET`\
**Language Code**: IANA standards

- `http://localhost:8081/v1/dictionary/{language_code}/antonyms/{word}`\
**Method**: `GET`\
**Language Code**: IANA standards

- `http://localhost:8081/v1/dictionary/{language_code}/pronunciations/{word}`\
**Method**: `GET`\
**Language Code**: IANA standards

- `http://localhost:8081/v1/dictionary/{language_code}/frequency/{word}`\
**Method**: `GET`\
**Language Code**: IANA standards
- `http://localhost:8081/v1/dictionary/{language_code}/frequency/{word}/{lexicalCategory}`\
**Method**: `GET`\
**Language Code**: IANA standards

- `http://localhost:8081/v1/dictionary/wiktionary/{language_code}/definition/{word}` (Wiktionary-specific)\
**Method**: `GET`\
**Language Code**: English (en), French (fr) and German (de)

- `http://localhost:8081/v1/dictionary/oxford/{language_code}/definition/{word}` (Oxford-specific)\
**Method**: `GET`\
**Language Code**: IANA standards

- `http://localhost:8081/v1/dictionary/oxford/{language_code}/synonyms/{word}` (Oxford-specific)\
**Method**: `GET`\
**Language Code**: IANA standards

- `http://localhost:8081/v1/dictionary/oxford/{language_code}/antonyms/{word}` (Oxford-specific)\
**Method**: `GET`\
**Language Code**: IANA standards

- `http://localhost:8081/v1/dictionary/oxford/{language_code}/pronunciations/{word}` (Oxford-specific)\
**Method**: `GET`\
**Language Code**: IANA standards

- `http://localhost:8081/v1/dictionary/oxford/{language_code}/frequency/{word}` (Oxford-specific)\
**Method**: `GET`\
**Language Code**: IANA standards
- `http://localhost:8081/v1/dictionary/oxford/{language_code}/frequency/{word}/{lexicalCategory}` (Oxford-specific)\
**Method**: `GET`\
**Language Code**: IANA standards

(Wiktionary only gives definition)

### NLP Service
- `http://localhost:8082/v1/nlp/compromise/tags`\
**Method**: `POST`\
**Request Body Format**: `{ sentence: "{sentence_to_be_tagged}" }`

Example endpoints:
- `http://localhost:8081/v1/dictionary/en/definition/horse`
- `http://localhost:8081/v1/dictionary/wiktionary/fr/definition/rien`
- `http://localhost:8081/v1/dictionary/oxford/en/definition/horse`

Tests for these endpoints lie in `share/dictionary/tests`\
To run all the tests in one go
```
npm test
```
when at the root of the repository.\
OR\
To run a particular test
```
node ./share/dictionary/tests/{testFolderName}/{testFileName}.js
```
when at the root of the repository.

Learn more about the service and the endpoints, in its documentation, which can be found [here](https://app.swaggerhub.com/apis/kunal4/fluid-adaptive-content-service/1.0.0).