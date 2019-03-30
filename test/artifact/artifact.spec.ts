import {describe, it} from 'mocha'
import {doesNotThrow, throws, strictEqual} from 'assert'
import {Artifact} from "../../src";

describe('Artifact', () => {

    describe('from', () => {
        it('should throw an exception when parsing fails', () => {
            throws(() => Artifact.from(undefined));
            throws(() => Artifact.from(null));
            throws(() => Artifact.from(''));
            throws(() => Artifact.from('groupId'));
            throws(() => Artifact.from('groupId:artifactId'));
        });

        it('should not throw an exception when parsing succeeds', () => {
            doesNotThrow(() => Artifact.from('com.company:artifact-id:version'));
            doesNotThrow(() => Artifact.from('com.company:artifact-id:version:classifier'));
        });

        it('should create a valid uri', () => {
            const reference = Artifact.from('org.seleniumhq.selenium:selenium-java:1.0.0');
            const referenceWithClassifier = Artifact.from('org.seleniumhq.selenium:selenium-java:1.0.0:classifier');

            strictEqual(reference.uri, 'org\\seleniumhq\\selenium\\selenium-java\\1.0.0\\selenium-java-1.0.0.jar');
            strictEqual(referenceWithClassifier.uri, 'org\\seleniumhq\\selenium\\selenium-java\\1.0.0\\selenium-java-1.0.0-classifier.jar');
        });

        it('should create a valid filename', () => {
            const reference = Artifact.from('org.seleniumhq.selenium:selenium-java:1.0.0');
            const referenceWithClassifier = Artifact.from('org.seleniumhq.selenium:selenium-java:1.0.0:classifier');

            strictEqual(reference.filename, 'selenium-java-1.0.0.jar');
            strictEqual(referenceWithClassifier.filename, 'selenium-java-1.0.0-classifier.jar');
        });

        it('should create a valid identifier', () => {
            const reference = Artifact.from('org.seleniumhq.selenium:selenium-java:1.0.0');
            const referenceWithClassifier = Artifact.from('org.seleniumhq.selenium:selenium-java:1.0.0:classifier');

            strictEqual(reference.identifier, `'org.seleniumhq.selenium:selenium-java:1.0.0'`);
            strictEqual(referenceWithClassifier.identifier, `'org.seleniumhq.selenium:selenium-java:1.0.0:classifier'`);
        });
    });

    describe('constructor', () => {
        it('should throw an exception when passed invalid values', () => {
            throws(() => new Artifact(null, 'artifactId', 'version'));
            throws(() => new Artifact(undefined, 'artifactId', 'version'));
            throws(() => new Artifact('groupId', null, 'version'));
            throws(() => new Artifact('groupId', undefined, 'version'));
            throws(() => new Artifact('groupId', 'artifactId', null));
            throws(() => new Artifact('groupId', 'artifactId', undefined));
        });

        it('should not throw an exception when passed valid values', () => {
            doesNotThrow(() => new Artifact('groupId', 'artifactId', 'version'));
        });

        it('should create a valid uri', () => {
            const reference = new Artifact('org.seleniumhq.selenium', 'selenium-java', '1.0.0');
            const referenceWithClassifier = new Artifact('org.seleniumhq.selenium', 'selenium-java', '1.0.0', 'classifier');

            strictEqual(reference.uri, 'org\\seleniumhq\\selenium\\selenium-java\\1.0.0\\selenium-java-1.0.0.jar');
            strictEqual(referenceWithClassifier.uri, 'org\\seleniumhq\\selenium\\selenium-java\\1.0.0\\selenium-java-1.0.0-classifier.jar');
        });

        it('should create a valid filename', () => {
            const reference = new Artifact('org.seleniumhq.selenium', 'selenium-java', '1.0.0');
            const referenceWithClassifier = new Artifact('org.seleniumhq.selenium', 'selenium-java', '1.0.0', 'classifier');

            strictEqual(reference.filename, 'selenium-java-1.0.0.jar');
            strictEqual(referenceWithClassifier.filename, 'selenium-java-1.0.0-classifier.jar');
        });

        it('should create a valid identifier', () => {
            const reference = new Artifact('org.seleniumhq.selenium', 'selenium-java', '1.0.0');
            const referenceWithClassifier = new Artifact('org.seleniumhq.selenium', 'selenium-java', '1.0.0', 'classifier');

            strictEqual(reference.identifier, `'org.seleniumhq.selenium:selenium-java:1.0.0'`);
            strictEqual(referenceWithClassifier.identifier, `'org.seleniumhq.selenium:selenium-java:1.0.0:classifier'`);
        });
    });
});