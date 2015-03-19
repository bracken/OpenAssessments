# https://canvas.instructure.com/doc/api/tools_xml.html
# LTI gem docs: https://github.com/instructure/ims-lti
module Lti

  class Canvas

    def self.tool_mode(env)
      "(#{env})" if env.present? && env != 'production'
    end

    def self.tool_name(env)
      "#{Rails.application.secrets.application_name} #{self.tool_mode(env)}"
    end

    def self.config_xml(args = {})
      self.config(args).to_xml(:indent => 2)
    end

    def self.config(args = {})
      title = args[:title] || self.tool_name(args[:env])

      tc = IMS::LTI::ToolConfig.new(
        title: title, 
        launch_url: args[:launch_url],
        description: args[:description] || "#{Rails.application.secrets.application_name}"
      )

      config = {
        'privacy_level' => 'public',
      }

      if args[:course_navigation].blank? && args[:account_navigation].blank?
        config['resource_selection'] = {
          'url' => args[:launch_url],
          'text' => title,
          'selection_width' => '892',
          'selection_height' => '800'
        }
      end

      if args[:course_navigation].present?
        config['course_navigation'] = {
          'url' => args[:launch_url],
          'default' => 'enabled',
          'visibility' => 'public',
          'text' => args[:course_navigation],
          'enabled' => true
        }
      end

      if args[:account_navigation].present?
        config['account_navigation'] = {
          'url' => args[:launch_url],
          'default' => 'enabled',
          'visibility' => 'public',
          'text' => args[:account_navigation],
          'enabled' => true
        }
      end
      
      if args[:button_url].present?
        config['editor_button'] = {
          'url' => args[:launch_url],
          'icon_url' => args[:button_url],
          'text' => args[:button_text] || title,
          'selection_width' => '892',
          'selection_height' => '800'
        }
      end

      tc.set_ext_params('canvas.instructure.com', config)
      tc
    end

  end

end