import Assessment         from './assessment';
import $                  from 'jquery';

describe('assessment', () => {
  
  var settings;

  beforeAll(function(){
    jasmine.getFixtures().fixturesPath = "base/fixtures/";
    settings = {};
  });

  describe('parseAssessment', () => {
    
    it('parses assessment xml from QTI into an object', () => {
      var data       = readFixtures("assessment.xml");
      var assessment = Assessment.parseAssessment(settings, data);

      expect(assessment).toBeDefined();
      expect(assessment.id).toEqual("ib8d9c142765b2287684aad0b5387e45b");
      expect(assessment.title).toEqual("MIT Questions 1");
      expect(assessment.standard).toEqual("qti");
      expect(assessment.sections.length).toEqual(1);
      expect(assessment.sections[0].items.length).toEqual(10);
      var item = assessment.sections[0].items[0];
      expect(item.assessment_question_identifierref).toEqual("icee9d09b0a2ace374f01019034d68155");
      expect(item.id).toEqual("i3590da31ca486c260f96e955482aca41");
      expect(item.title).toEqual("Question 1");
    });
  });

  describe('parseQti', () => {
    
    it('parses assessment xml from QTI into an object', () => {
      var data          = readFixtures("biology.xml");
      var xml           = $(data);
      var assessmentXml = xml.find('assessment').addBack('assessment');
    
      var assessment = Assessment.parseQti(assessmentXml, xml);

      expect(assessment).toBeDefined();
      expect(assessment.id).toEqual("ch01");
      expect(assessment.title).toEqual("ch01");
      expect(assessment.standard).toEqual("qti");
      expect(assessment.sections.length).toEqual(1);
      expect(assessment.sections[0].items.length).toEqual(4);
      var item = assessment.sections[0].items[0];
      expect(item.id).toEqual("ch01sec1q0");
      expect(item.title).toEqual("1.1 Exercise 2.");
    });
  });

  describe('parseEdX', () => {
    
    beforeEach(function() {
      jasmine.Ajax.install();
      jasmine.Ajax.stubRequest('/edXCourse/vertical/04735103fe064c9da3a1a758bcda2692.xml').andReturn({
        "responseText": readFixtures("edXCourse/vertical/04735103fe064c9da3a1a758bcda2692.xml")
      });
    });
    
    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it('parses assessment xml from EdX into an object', () => {
      settings = {
        srcUrl: "edXCourse/sequential/97cc2d1812204294b5fcbb91a1157368.xml"
      };
      var sequential = $(readFixtures("edXCourse/sequential/97cc2d1812204294b5fcbb91a1157368.xml"));
      var assessment = Assessment.parseEdX(settings, sequential);

      expect(assessment).toBeDefined();
      expect(assessment.id).toEqual("sequential/97cc2d1812204294b5fcbb91a1157368");
      expect(assessment.title).toEqual("Subsection One");
      expect(assessment.standard).toEqual("edX");
      expect(assessment.sections.length).toEqual(1);
    });
  });

});
