require 'rails_helper'

describe Item do
  describe 'item' do
    before do
      @section = FactoryGirl.create(:section)
      identifier = FactoryGirl.generate(:name)
      @xml = '<item ident="' + identifier + '" title="Question 2"> <itemmetadata> <qtimetadata> <qtimetadatafield> <fieldlabel>question_type</fieldlabel> <fieldentry>multiple_choice_question</fieldentry> </qtimetadatafield> <qtimetadatafield> <fieldlabel>points_possible</fieldlabel> <fieldentry>1</fieldentry> </qtimetadatafield> <qtimetadatafield> <fieldlabel>assessment_question_identifierref</fieldlabel> <fieldentry>ib550dd245ac5e15799afb9245f6548ff</fieldentry> </qtimetadatafield> </qtimetadata> </itemmetadata> <presentation> <material> <mattext texttype="text/html">&lt;div&gt;&lt;p&gt;&lt;img class="equation_image" title="\frac{4}{5}\:?\:\frac{6}{7}" src="https://canvas.instructure.com/equation_images/%255Cfrac%257B4%257D%257B5%257D%255C%253A%253F%255C%253A%255Cfrac%257B6%257D%257B7%257D" alt="\frac{4}{5}\:?\:\frac{6}{7}"&gt;&lt;/p&gt;&lt;/div&gt;</mattext> </material> <response_lid ident="response1" rcardinality="Single"> <render_choice> <response_label ident="1602"> <material> <mattext texttype="text/plain">Greater than (&gt;)</mattext> </material> </response_label> <response_label ident="8292"> <material> <mattext texttype="text/plain">Less than (&lt;)</mattext> </material> </response_label> <response_label ident="2753"> <material> <mattext texttype="text/plain">Equivalent (=)</mattext> </material> </response_label> </render_choice> </response_lid> </presentation> <resprocessing> <outcomes> <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/> </outcomes> <respcondition continue="No"> <conditionvar> <varequal respident="response1">1602</varequal> </conditionvar> <setvar action="Set" varname="SCORE">100</setvar> </respcondition> </resprocessing> </item>'
      @item = Item.from_xml(@xml, @section)
    end

    it 'should extract the question_text' do
      expect(@item.question_text).to match /<div.*<\/div>/
    end

    it 'should extract an array of answers' do
      expect(@item.get_answers.count).to eq(3)
    end

    it 'should create and answer with an id' do
      expect(@item.get_answers.first.id).to eq('1602')
    end

    it 'should create an answer with the answer text' do
      expect(@item.get_answers.first.text).to match /Greater than \(>\)/
    end

    it 'should respond true if the response is correct' do
      expect(@item.is_correct?('1602')).to eq(true)
    end

    it 'should extract the question_type' do
      expect(@item.base_type).to match 'multiple_choice_question'
    end

    it 'should add keywords to assessment' do
      keyword = FactoryGirl.generate(:name)
      @item.keyword_list.add(keyword, parse: true)
      @item.save!
      expect(Item.tagged_with(keyword).first).to eq(@item)
    end
  end

  describe 'results' do
    before do
      @section = FactoryGirl.create(:section)
      identifier = FactoryGirl.generate(:name)
      @eid = FactoryGirl.generate(:name)
      @xml = '<item ident="' + identifier + '" title="Question 2"> <itemmetadata> <qtimetadata> <qtimetadatafield> <fieldlabel>question_type</fieldlabel> <fieldentry>multiple_choice_question</fieldentry> </qtimetadatafield> <qtimetadatafield> <fieldlabel>points_possible</fieldlabel> <fieldentry>1</fieldentry> </qtimetadatafield> <qtimetadatafield> <fieldlabel>assessment_question_identifierref</fieldlabel> <fieldentry>ib550dd245ac5e15799afb9245f6548ff</fieldentry> </qtimetadatafield> </qtimetadata> </itemmetadata> <presentation> <material> <mattext texttype="text/html">&lt;div&gt;&lt;p&gt;&lt;img class="equation_image" title="\frac{4}{5}\:?\:\frac{6}{7}" src="https://canvas.instructure.com/equation_images/%255Cfrac%257B4%257D%257B5%257D%255C%253A%253F%255C%253A%255Cfrac%257B6%257D%257B7%257D" alt="\frac{4}{5}\:?\:\frac{6}{7}"&gt;&lt;/p&gt;&lt;/div&gt;</mattext> </material> <response_lid ident="response1" rcardinality="Single"> <render_choice> <response_label ident="1602"> <material> <mattext texttype="text/plain">Greater than (&gt;)</mattext> </material> </response_label> <response_label ident="8292"> <material> <mattext texttype="text/plain">Less than (&lt;)</mattext> </material> </response_label> <response_label ident="2753"> <material> <mattext texttype="text/plain">Equivalent (=)</mattext> </material> </response_label> </render_choice> </response_lid> </presentation> <resprocessing> <outcomes> <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/> </outcomes> <respcondition continue="No"> <conditionvar> <varequal respident="response1">1602</varequal> </conditionvar> <setvar action="Set" varname="SCORE">100</setvar> </respcondition> </resprocessing> </item>'
      @item = Item.from_xml(@xml, @section)
      @item_result = ItemResult.new(
        identifier: @item.identifier,
        eid: @eid,
        item_id: @item.id,
        rendered_datestamp: Time.now-1,
        datestamp: Time.now,
        referer: 'http://localhost:3000/items',
        ip_address: "127.0.0.1",
        session_status: "final"
      )
      @item.item_results << @item_result
    end

  end

end
