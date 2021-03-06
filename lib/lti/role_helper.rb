module Lti
class RoleHelper

  attr_reader :roles

  def initialize(role_string)
    self.roles = role_string
  end

  def roles=(roles_list)
    if roles_list
      if roles_list.is_a?(Array)
        @roles = roles_list
      else
        @roles = roles_list.split(",").map(&:downcase)
      end
    else
      @roles = []
    end
  end

  def has_exact_role?(role)
    role = role.downcase
    @roles && @roles.any? { |r| r == role }
  end

  def institution_admin?
    has_exact_role?('urn:lti:instrole:ims/lis/Administrator')
  end

  def context_student?
    # `Student` isn't in the LTI docs as a standard context role, but some TCs send it.
    has_exact_role?('Learner') || has_exact_role?('urn:lti:role:ims/lis/Learner') || has_exact_role?('Student')
  end

  def context_instructor?
    has_exact_role?('Instructor') || has_exact_role?('urn:lti:role:ims/lis/Instructor')
  end

  def context_content_developer?
    has_exact_role?('ContentDeveloper') || has_exact_role?('urn:lti:role:ims/lis/ContentDeveloper')
  end

  def context_admin?
    has_exact_role?('Administrator') || has_exact_role?('urn:lti:role:ims/lis/Administrator')
  end

  def context_ta?
    has_exact_role?('TeachingAssistant') || has_exact_role?('urn:lti:role:ims/lis/TeachingAssistant')
  end
end
end